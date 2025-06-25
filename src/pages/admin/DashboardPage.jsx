import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Breadcrumb, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Spin,
  message,
  Alert
} from 'antd';
import { Link } from 'react-router-dom';
import getNotificationItems from '../../components/admin/NotificationItems';
import AdminHeader from '../../components/admin/Header';
import Sidebar from '../../components/admin/SideBar';
import StatisticsCards from '../../components/admin/dashboard/StatisticsCards';
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable';
import CategoryPercentages from '../../components/admin/dashboard/CategoryPercentages';
import { getDashboardStatistics, getRecentOrders, getCategoryPercentages } from '../../services/statistics';

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryPercentages, setCategoryPercentages] = useState([]);
  const [error, setError] = useState(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Lấy dữ liệu thông báo
  const notificationItems = getNotificationItems();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [statsResponse, ordersResponse, categoriesResponse] = await Promise.all([
          getDashboardStatistics(),
          getRecentOrders(),
          getCategoryPercentages()
        ]);
        
        console.log('Dashboard stats response:', statsResponse);
        console.log('Recent orders response:', ordersResponse);
        console.log('Category percentages response:', categoriesResponse);
        
        // Đảm bảo dữ liệu hợp lệ từ API
        if (statsResponse && statsResponse.data) {
          setDashboardStats(statsResponse.data);
        } else {
          console.warn('Invalid stats data format:', statsResponse);
          setDashboardStats({
            revenue: { today: 0, yesterday: 0, percent: 0 },
            orders: { today: 0, yesterday: 0, percent: 0 },
            productsSold: { today: 0, yesterday: 0, percent: 0 },
            newUsers: { today: 0, yesterday: 0, percent: 0 }
          });
        }
        
        if (ordersResponse && Array.isArray(ordersResponse.data)) {
          setRecentOrders(ordersResponse.data);
        } else {
          console.warn('Invalid orders data format:', ordersResponse);
          setRecentOrders([]);
        }
        
        if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
          setCategoryPercentages(categoriesResponse.data);
        } else {
          console.warn('Invalid categories data format:', categoriesResponse);
          setCategoryPercentages([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
        message.error("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
      
      <Layout className="min-h-screen" style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <AdminHeader 
          collapsed={collapsed} 
          toggleCollapsed={toggleCollapsed} 
          notificationItems={notificationItems} 
          className="z-50"
        />
        
        <Content className="m-4 p-4 bg-white rounded-lg">
          {/* Dashboard Content Start */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Tổng quan</Breadcrumb.Item>
          </Breadcrumb>
          
          <div className="mb-6">
            <Title level={3} className="mb-0">Dashboard</Title>
            <Text type="secondary">Chào mừng trở lại, Admin</Text>
          </div>
          
          {error && (
            <Alert 
              message="Lỗi tải dữ liệu" 
              description={error}
              type="error" 
              showIcon 
              className="mb-4"
            />
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <StatisticsCards stats={dashboardStats} />
              
              <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={16}>
                  <RecentOrdersTable orders={recentOrders} />
                </Col>
                
                <Col xs={24} lg={8}>
                  <CategoryPercentages categories={categoryPercentages} />
                </Col>
              </Row>
            </>
          )}
          {/* Dashboard Content End */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardPage;