const { db } = require("../config/firebase.config");
const { logger } = require("../logger/FirebaseLogger");
const { OrderStatus, DeliveryMethod, PaymentMethod } = require("../models/order.model");
const { ReservationStatus } = require("../models/reservation.model");
const TableService = require("./table.service");

class AnalyticsService {
  static async getRevenueAnalytics(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffTimestamp = cutoffDate.getTime();

      const ordersSnapshot = await db
        .collection("orders")
        .where("status", "in", [OrderStatus.COMPLETED])
        .where("updatedAt", ">=", cutoffTimestamp)
        .get();

      if (ordersSnapshot.empty) {
        return {
          totalRevenue: 0,
          dailyRevenue: {},
          weeklyRevenue: {},
          revenueByPaymentMethod: {},
          revenueByDeliveryMethod: {},
          averageOrderValue: 0,
        };
      }

      const orders = [];
      ordersSnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

      const averageOrderValue = totalRevenue / orders.length;

      const dailyRevenue = {};

      const weeklyRevenue = {};

      const revenueByPaymentMethod = {
        [PaymentMethod.ONLINE]: 0,
        [PaymentMethod.CASH_ON_DELIVERY]: 0,
        [PaymentMethod.IN_STORE]: 0,
      };

      const revenueByDeliveryMethod = {
        [DeliveryMethod.HOME_DELIVERY]: 0,
        [DeliveryMethod.PICKUP]: 0,
      };

      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const dateStr = orderDate.toISOString().split("T")[0];
        dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + order.total;

        const weekStart = new Date(orderDate);
        weekStart.setDate(orderDate.getDate() - orderDate.getDay());
        const weekKey = weekStart.toISOString().split("T")[0];
        weeklyRevenue[weekKey] = (weeklyRevenue[weekKey] || 0) + order.total;

        revenueByPaymentMethod[order.paymentMethod] =
          (revenueByPaymentMethod[order.paymentMethod] || 0) + order.total;

        revenueByDeliveryMethod[order.deliveryMethod] =
          (revenueByDeliveryMethod[order.deliveryMethod] || 0) + order.total;
      });

      return {
        totalRevenue,
        dailyRevenue,
        weeklyRevenue,
        revenueByPaymentMethod,
        revenueByDeliveryMethod,
        averageOrderValue,
      };
    } catch (error) {
      logger.error("Error getting revenue analytics:", error);
      throw error;
    }
  }

  static async getMenuItemAnalytics(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffTimestamp = cutoffDate.getTime();

      const menuItemsSnapshot = await db.collection("menuItems").get();
      const menuItems = {};
      menuItemsSnapshot.forEach((doc) => {
        menuItems[doc.id] = { id: doc.id, ...doc.data(), totalQuantity: 0, totalRevenue: 0 };
      });

      const ordersSnapshot = await db
        .collection("orders")
        .where("status", "in", [OrderStatus.COMPLETED])
        .where("updatedAt", ">=", cutoffTimestamp)
        .get();

      if (ordersSnapshot.empty) {
        return {
          topItems: [],
          bottomItems: [],
          itemsByQuantity: {},
          itemsByRevenue: {},
          averagePreparationTime: 0,
        };
      }

      const orders = [];
      ordersSnapshot.forEach((doc) => {
        const order = { id: doc.id, ...doc.data() };
        orders.push(order);

        order.items.forEach((item) => {
          if (menuItems[item.id]) {
            menuItems[item.id].totalQuantity =
              (menuItems[item.id].totalQuantity || 0) + item.quantity;
            menuItems[item.id].totalRevenue =
              (menuItems[item.id].totalRevenue || 0) + item.price * item.quantity;
          }
        });
      });

      const menuItemsArray = Object.values(menuItems).filter((item) => item.totalQuantity > 0);

      const topItemsByQuantity = [...menuItemsArray]
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10);
      const bottomItemsByQuantity = [...menuItemsArray]
        .sort((a, b) => a.totalQuantity - b.totalQuantity)
        .slice(0, 10);

      const itemsByRevenue = [...menuItemsArray].sort((a, b) => b.totalRevenue - a.totalRevenue);

      let totalPreparationTime = 0;
      let preparationTimeCount = 0;

      menuItemsArray.forEach((item) => {
        if (item.avgWaitTime) {
          totalPreparationTime += item.avgWaitTime;
          preparationTimeCount++;
        }
      });

      const averagePreparationTime =
        preparationTimeCount > 0 ? totalPreparationTime / preparationTimeCount : 0;

      return {
        topItems: topItemsByQuantity,
        bottomItems: bottomItemsByQuantity,
        itemsByQuantity: menuItemsArray.reduce((acc, item) => {
          acc[item.id] = item.totalQuantity;
          return acc;
        }, {}),
        itemsByRevenue: itemsByRevenue,
        averagePreparationTime,
      };
    } catch (error) {
      logger.error("Error getting menu item analytics:", error);
      throw error;
    }
  }

  static async getReservationAnalytics(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);

      const reservationsSnapshot = await db
        .collection("reservations")
        .where("startTime", ">=", cutoffTimestamp)
        .get();

      if (reservationsSnapshot.empty) {
        return {
          totalReservations: 0,
          reservationsByStatus: {},
          reservationsByDayOfWeek: {},
          averagePartySize: 0,
          tablePopularity: {},
          cancellationRate: 0,
        };
      }

      const reservations = [];
      const tableNumCache = {};

      for (const doc of reservationsSnapshot.docs) {
        const data = doc.data();
        const tableId = data.tableId;

        if (!tableNumCache[tableId]) {
          try {
            const table = await TableService.getTable(tableId.toString());
            tableNumCache[tableId] = table ? table.tabeleNum : "Unknown";
          } catch (e) {
            logger.error(`Error fetching table ${tableId}:`, e);
            tableNumCache[tableId] = "Unknown";
          }
        }

        reservations.push({
          id: doc.id,
          ...data,
          tableNum: tableNumCache[tableId],
          startTime: new Date(data.startTime * 1000),
          endTime: new Date(data.endTime * 1000),
        });
      }

      const totalReservations = reservations.length;

      const reservationsByStatus = {
        [ReservationStatus.PENDING]: 0,
        [ReservationStatus.CONFIRMED]: 0,
        [ReservationStatus.CANCELLED]: 0,
        [ReservationStatus.COMPLETED]: 0,
      };

      const reservationsByDayOfWeek = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };

      const tablePopularity = {};

      let totalPartySize = 0;

      reservations.forEach((reservation) => {
        reservationsByStatus[reservation.status] =
          (reservationsByStatus[reservation.status] || 0) + 1;

        const dayOfWeek = reservation.startTime.getDay();
        reservationsByDayOfWeek[dayOfWeek] = (reservationsByDayOfWeek[dayOfWeek] || 0) + 1;

        const tableKey = tableNumCache[reservation.tableId];
        tablePopularity[tableKey] = (tablePopularity[tableKey] || 0) + 1;

        totalPartySize += reservation.people;
      });

      const averagePartySize = totalPartySize / totalReservations;

      const cancellationRate =
        reservationsByStatus[ReservationStatus.CANCELLED] / totalReservations;

      return {
        totalReservations,
        reservationsByStatus,
        reservationsByDayOfWeek,
        averagePartySize,
        tablePopularity,
        cancellationRate,
      };
    } catch (error) {
      logger.error("Error getting reservation analytics:", error);
      throw error;
    }
  }

  static async getOrderStatusAnalytics(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffTimestamp = cutoffDate.getTime();

      const ordersSnapshot = await db
        .collection("orders")
        .where("createdAt", ">=", cutoffTimestamp)
        .get();

      if (ordersSnapshot.empty) {
        return {
          ordersByStatus: {},
          averageCompletionTime: 0,
          ordersByPaymentMethod: {},
          ordersByDeliveryMethod: {},
        };
      }

      const orders = [];
      ordersSnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      const ordersByStatus = {
        [OrderStatus.PENDING_PAYMENT]: 0,
        [OrderStatus.PAID]: 0,
        [OrderStatus.IN_PROGRESS]: 0,
        [OrderStatus.READY_FOR_PICKUP]: 0,
        [OrderStatus.OUT_FOR_DELIVERY]: 0,
        [OrderStatus.COMPLETED]: 0,
        [OrderStatus.CANCELED]: 0,
      };

      const ordersByPaymentMethod = {
        [PaymentMethod.ONLINE]: 0,
        [PaymentMethod.CASH_ON_DELIVERY]: 0,
        [PaymentMethod.IN_STORE]: 0,
      };

      const ordersByDeliveryMethod = {
        [DeliveryMethod.HOME_DELIVERY]: 0,
        [DeliveryMethod.PICKUP]: 0,
      };

      let totalCompletionTime = 0;
      let completedOrders = 0;

      orders.forEach((order) => {
        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;

        ordersByPaymentMethod[order.paymentMethod] =
          (ordersByPaymentMethod[order.paymentMethod] || 0) + 1;

        ordersByDeliveryMethod[order.deliveryMethod] =
          (ordersByDeliveryMethod[order.deliveryMethod] || 0) + 1;

        if (order.status === OrderStatus.COMPLETED && order.updatedAt && order.createdAt) {
          totalCompletionTime += order.updatedAt - order.createdAt;
          completedOrders++;
        }
      });

      const averageCompletionTime =
        completedOrders > 0 ? totalCompletionTime / completedOrders / (1000 * 60) : 0;

      return {
        ordersByStatus,
        averageCompletionTime,
        ordersByPaymentMethod,
        ordersByDeliveryMethod,
      };
    } catch (error) {
      logger.error("Error getting order status analytics:", error);
      throw error;
    }
  }

  static async getCustomerAnalytics(days = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffTimestamp = cutoffDate.getTime();

      const ordersSnapshot = await db
        .collection("orders")
        .where("createdAt", ">=", cutoffTimestamp)
        .get();

      if (ordersSnapshot.empty) {
        return {
          totalCustomers: 0,
          returning: 0,
          averageOrdersPerCustomer: 0,
          topCustomers: [],
        };
      }

      const orders = [];
      ordersSnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      const customerOrders = {};

      orders.forEach((order) => {
        if (!order.userId) return;

        if (!customerOrders[order.userId]) {
          customerOrders[order.userId] = [];
        }
        customerOrders[order.userId].push(order);
      });

      const totalCustomers = Object.keys(customerOrders).length;
      const customersWithMultipleOrders = Object.values(customerOrders).filter(
        (orders) => orders.length > 1
      ).length;

      const returning =
        totalCustomers > 0 ? (customersWithMultipleOrders / totalCustomers) * 100 : 0;

      const totalOrders = orders.length;
      const averageOrdersPerCustomer = totalCustomers > 0 ? totalOrders / totalCustomers : 0;

      const topCustomersByOrderCount = Object.entries(customerOrders)
        .map(([userId, orders]) => ({
          userId,
          orderCount: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 10);

      const topCustomers = [];
      for (const customer of topCustomersByOrderCount) {
        try {
          const userDoc = await db.collection("users").doc(customer.userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            topCustomers.push({
              ...customer,
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              phoneNumber: userData.phoneNumber,
            });
          } else {
            topCustomers.push(customer);
          }
        } catch (error) {
          logger.error(`Error fetching user details for ${customer.userId}:`, error);
          topCustomers.push(customer);
        }
      }

      return {
        totalCustomers,
        returning,
        averageOrdersPerCustomer,
        topCustomers,
      };
    } catch (error) {
      logger.error("Error getting customer analytics:", error);
      throw error;
    }
  }

  static async getOperationalAnalytics() {
    try {
      const tablesSnapshot = await db.collection("tables").where("isActive", "==", true).get();

      const tables = [];
      tablesSnapshot.forEach((doc) => {
        tables.push({ id: doc.id, ...doc.data() });
      });

      const activeOrdersSnapshot = await db
        .collection("orders")
        .where("status", "in", [
          OrderStatus.PENDING_PAYMENT,
          OrderStatus.PAID,
          OrderStatus.IN_PROGRESS,
          OrderStatus.READY_FOR_PICKUP,
          OrderStatus.OUT_FOR_DELIVERY,
        ])
        .get();

      const activeOrders = [];
      activeOrdersSnapshot.forEach((doc) => {
        activeOrders.push({ id: doc.id, ...doc.data() });
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Math.floor(today.getTime() / 1000);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);

      const todayReservationsSnapshot = await db
        .collection("reservations")
        .where("startTime", ">=", todayTimestamp)
        .where("startTime", "<", tomorrowTimestamp)
        .get();

      const todayReservations = [];
      const tableNumCache = {};

      for (const doc of todayReservationsSnapshot.docs) {
        const data = doc.data();
        const tableId = data.tableId;

        if (!tableNumCache[tableId]) {
          try {
            const table = await TableService.getTable(tableId.toString());
            tableNumCache[tableId] = table ? table.tabeleNum : "Unknown";
          } catch (e) {
            logger.error(`Error fetching table ${tableId}:`, e);
            tableNumCache[tableId] = "Unknown";
          }
        }

        todayReservations.push({
          id: doc.id,
          ...data,
          tableNum: tableNumCache[tableId],
        });
      }

      const totalTables = tables.length;
      const tablesWithReservations = new Set(todayReservations.map((r) => r.tableId)).size;
      const tableUtilizationRate =
        totalTables > 0 ? (tablesWithReservations / totalTables) * 100 : 0;

      const pendingOrders = activeOrders.filter(
        (o) => o.status === OrderStatus.PENDING_PAYMENT || o.status === OrderStatus.PAID
      ).length;
      const inProgressOrders = activeOrders.filter(
        (o) => o.status === OrderStatus.IN_PROGRESS
      ).length;
      const readyOrders = activeOrders.filter(
        (o) =>
          o.status === OrderStatus.READY_FOR_PICKUP || o.status === OrderStatus.OUT_FOR_DELIVERY
      ).length;

      const employeesSnapshot = await db
        .collection("users")
        .where("privileges", "in", ["employee", "owner"])
        .get();

      const employeeCount = employeesSnapshot.size;

      return {
        currentStats: {
          activeTables: totalTables,
          tableUtilizationRate,
          pendingOrders,
          inProgressOrders,
          readyOrders,
          todayReservations: todayReservations.length,
          employeeCount,
        },
        tables,
        activeOrders,
        todayReservations,
      };
    } catch (error) {
      logger.error("Error getting operational analytics:", error);
      throw error;
    }
  }

  static async getDashboardSummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStart = today.getTime();

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStart = tomorrow.getTime();

      const todayOrdersSnapshot = await db
        .collection("orders")
        .where("status", "==", OrderStatus.COMPLETED)
        .where("updatedAt", ">=", todayStart)
        .where("updatedAt", "<", tomorrowStart)
        .get();

      let todayRevenue = 0;
      let todayOrders = 0;

      todayOrdersSnapshot.forEach((doc) => {
        const order = doc.data();
        todayRevenue += order.total;
        todayOrders++;
      });

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStart = yesterday.getTime();

      const yesterdayOrdersSnapshot = await db
        .collection("orders")
        .where("status", "==", OrderStatus.COMPLETED)
        .where("updatedAt", ">=", yesterdayStart)
        .where("updatedAt", "<", todayStart)
        .get();

      let yesterdayRevenue = 0;

      yesterdayOrdersSnapshot.forEach((doc) => {
        const order = doc.data();
        yesterdayRevenue += order.total;
      });

      const revenueChange =
        yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;

      const activeOrdersSnapshot = await db
        .collection("orders")
        .where("status", "in", [
          OrderStatus.PENDING_PAYMENT,
          OrderStatus.PAID,
          OrderStatus.IN_PROGRESS,
          OrderStatus.READY_FOR_PICKUP,
          OrderStatus.OUT_FOR_DELIVERY,
        ])
        .get();

      const activeOrdersCount = activeOrdersSnapshot.size;

      const todayReservationsSnapshot = await db
        .collection("reservations")
        .where("startTime", ">=", Math.floor(todayStart / 1000))
        .where("startTime", "<", Math.floor(tomorrowStart / 1000))
        .where("status", "in", [ReservationStatus.PENDING, ReservationStatus.CONFIRMED])
        .get();

      const todayReservationsCount = todayReservationsSnapshot.size;

      return {
        todayRevenue,
        todayOrders,
        revenueChange,
        activeOrdersCount,
        todayReservationsCount,
      };
    } catch (error) {
      logger.error("Error getting dashboard summary:", error);
      throw error;
    }
  }

  static async getAllAnalytics(days = 30) {
    try {
      const [
        dashboardSummary,
        revenueAnalytics,
        menuItemAnalytics,
        reservationAnalytics,
        orderStatusAnalytics,
        customerAnalytics,
        operationalAnalytics,
      ] = await Promise.all([
        this.getDashboardSummary(),
        this.getRevenueAnalytics(days),
        this.getMenuItemAnalytics(days),
        this.getReservationAnalytics(days),
        this.getOrderStatusAnalytics(days),
        this.getCustomerAnalytics(days),
        this.getOperationalAnalytics(),
      ]);

      return {
        dashboardSummary,
        revenueAnalytics,
        menuItemAnalytics,
        reservationAnalytics,
        orderStatusAnalytics,
        customerAnalytics,
        operationalAnalytics,
      };
    } catch (error) {
      logger.error("Error getting all analytics:", error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;
