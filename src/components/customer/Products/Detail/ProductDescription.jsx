import React from 'react';
import { Typography, Row, Col, Divider, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

const ProductDescription = ({ product }) => {
  // Tạo mô tả chi tiết dựa trên loại sản phẩm
  const generateDetailedDescription = () => {
    const baseDescription = product.description;
    
    // Mô tả thêm dựa trên loại đồng hồ
    let additionalContent = '';
    
    switch (product.category) {
      case 'mechanical':
        additionalContent = `
          <h3>Bộ máy cơ chính xác</h3>
          <p>Đồng hồ ${product.name} được trang bị bộ máy cơ tự động (Automatic) với công nghệ tiên tiến từ ${product.brand}. Bộ máy này hoạt động thông qua chuyển động của cổ tay người đeo, không cần pin, mang lại độ chính xác cao và tuổi thọ lâu dài. Với 21 chân kính và khả năng dự trữ năng lượng lên đến 40 giờ, đồng hồ luôn sẵn sàng đồng hành cùng bạn trong mọi hoạt động.</p>
          
          <h3>Thiết kế sang trọng</h3>
          <p>Mặt đồng hồ được chế tác tinh xảo với các chi tiết được hoàn thiện thủ công. Vỏ đồng hồ được làm từ thép không gỉ 316L cao cấp, mang lại độ bền vượt trội và khả năng chống ăn mòn tuyệt vời. Mặt kính sapphire cứng cáp giúp bảo vệ đồng hồ khỏi các vết xước và tác động bên ngoài.</p>
          
          <h3>Đẳng cấp và phong cách</h3>
          <p>${product.name} không chỉ là một thiết bị đo thời gian mà còn là biểu tượng của phong cách và đẳng cấp. Thiết kế cổ điển với các chi tiết hiện đại tạo nên sự hài hòa hoàn hảo, phù hợp với cả trang phục công sở lẫn những dịp trang trọng.</p>
        `;
        break;
      case 'smart':
        additionalContent = `
          <h3>Công nghệ hiện đại</h3>
          <p>${product.name} là chiếc đồng hồ thông minh tích hợp nhiều công nghệ tiên tiến nhất hiện nay. Với màn hình AMOLED có độ phân giải cao, đồng hồ hiển thị rõ nét trong mọi điều kiện ánh sáng. Hệ điều hành trực quan và mượt mà giúp bạn dễ dàng điều khiển và truy cập các tính năng.</p>
          
          <h3>Theo dõi sức khỏe toàn diện</h3>
          <p>Được trang bị nhiều cảm biến tiên tiến, đồng hồ có thể theo dõi nhịp tim, mức độ oxy trong máu (SpO2), chất lượng giấc ngủ và nhiều chỉ số sức khỏe khác. Các thuật toán thông minh phân tích dữ liệu và đưa ra các gợi ý để cải thiện sức khỏe của bạn.</p>
          
          <h3>Kết nối không giới hạn</h3>
          <p>Với kết nối Bluetooth, WiFi và GPS tích hợp, ${product.name} luôn giữ bạn kết nối với thế giới. Nhận thông báo, trả lời tin nhắn, nghe nhạc hoặc thanh toán không tiếp xúc - tất cả đều có thể thực hiện từ cổ tay của bạn.</p>
        `;
        break;
      case 'sport':
        additionalContent = `
          <h3>Thiết kế cho vận động</h3>
          <p>${product.name} được thiết kế đặc biệt để đồng hành cùng người dùng trong các hoạt động thể thao. Với chất liệu nhẹ và bền, đồng hồ tạo cảm giác thoải mái khi đeo trong thời gian dài. Dây đeo cao su/silicone chất lượng cao có khả năng chống mồ hôi và chống nước, phù hợp với môi trường vận động cường độ cao.</p>
          
          <h3>Độ bền vượt trội</h3>
          <p>Đồng hồ thể thao ${product.name} có khả năng chống va đập và chống nước ở độ sâu 100m, giúp bạn yên tâm trong mọi hoạt động, từ bơi lội đến lặn nông. Vỏ đồng hồ được gia cố để chịu được các tác động mạnh, trong khi mặt kính cứng cáp bảo vệ đồng hồ khỏi trầy xước.</p>
          
          <h3>Tính năng chuyên nghiệp</h3>
          <p>Được trang bị đầy đủ các tính năng như bấm giờ, đồng hồ bấm giờ, đèn nền, ${product.name} hỗ trợ tối đa cho các hoạt động thể thao và ngoài trời. Độ chính xác cao và dễ đọc trong mọi điều kiện ánh sáng giúp bạn luôn kiểm soát được thời gian.</p>
        `;
        break;
      case 'classic':
      default:
        additionalContent = `
          <h3>Vẻ đẹp vượt thời gian</h3>
          <p>${product.name} mang thiết kế cổ điển thanh lịch đã được chứng minh qua thời gian. Mặt đồng hồ tinh tế với các chỉ số được sắp xếp hài hòa và kim đồng hồ mỏng thanh thoát tạo nên vẻ đẹp không bao giờ lỗi thời. Đây là chiếc đồng hồ có thể truyền từ thế hệ này sang thế hệ khác.</p>
          
          <h3>Chất lượng đáng tin cậy</h3>
          <p>Được chế tác theo tiêu chuẩn cao nhất của ngành đồng hồ, ${product.name} sử dụng bộ máy Quartz chính xác với thời lượng pin lên đến 3 năm. Vỏ đồng hồ thép không gỉ và mặt kính sapphire đảm bảo độ bền và khả năng chống trầy xước tuyệt vời.</p>
          
          <h3>Phù hợp mọi dịp</h3>
          <p>Với thiết kế linh hoạt, ${product.name} là lựa chọn hoàn hảo cho cả trang phục công sở lẫn những buổi gặp gỡ thân mật. Dây đeo da cao cấp không chỉ tạo cảm giác thoải mái mà còn dễ dàng kết hợp với nhiều phong cách thời trang khác nhau.</p>
        `;
    }
    
    return { baseDescription, additionalContent };
  };
  
  const { baseDescription, additionalContent } = generateDetailedDescription();

  // Các đặc điểm nổi bật (tùy thuộc vào loại đồng hồ)
  const highlights = {
    mechanical: [
      'Bộ máy cơ tự động (Automatic) chính xác',
      'Vỏ thép không gỉ 316L cao cấp',
      'Mặt kính sapphire chống trầy',
      'Dự trữ năng lượng lên đến 40 giờ',
      '21 chân kính, độ chính xác cao'
    ],
    smart: [
      'Màn hình AMOLED độ phân giải cao',
      'Pin sử dụng lên đến 18 giờ',
      'Theo dõi sức khỏe toàn diện',
      'Kết nối Bluetooth, WiFi, GPS',
      'Chống nước 3 ATM'
    ],
    sport: [
      'Thiết kế chống va đập',
      'Chống nước 10 ATM (100m)',
      'Dây đeo cao su/silicone thoải mái',
      'Khả năng bấm giờ chính xác',
      'Hiển thị rõ trong mọi điều kiện'
    ],
    classic: [
      'Thiết kế cổ điển thanh lịch',
      'Bộ máy Quartz bền bỉ',
      'Dây da cao cấp thoải mái',
      'Mặt kính sapphire chống trầy',
      'Pin sử dụng lên đến 3 năm'
    ]
  };
  
  const currentHighlights = highlights[product.category] || highlights.classic;

  return (
    <div className="product-description py-8">
      <Row gutter={[24, 48]}>
        <Col xs={24}>
          <Paragraph className="text-lg leading-relaxed">{baseDescription}</Paragraph>
        </Col>
        
        <Col xs={24} md={12}>
          <Card bordered={false} className="bg-gray-50 h-full">
            <Title level={4}>Đặc điểm nổi bật</Title>
            <ul className="pl-5 mt-4">
              {currentHighlights.map((highlight, index) => (
                <li key={index} className="mb-2 text-base">
                  <Text>{highlight}</Text>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card className="border-verdigris-500 border-2 h-full">
            <Title level={4} className="text-verdigris-500">Lý do chọn {product.name}</Title>
            <Paragraph className="text-base">
              Sự kết hợp hoàn hảo giữa công nghệ tiên tiến và thiết kế đẹp mắt. {product.brand} là thương hiệu nổi tiếng với lịch sử lâu đời trong ngành đồng hồ, đảm bảo về chất lượng và độ tin cậy.
            </Paragraph>
            <Paragraph className="text-base">
              Mỗi chiếc đồng hồ đều trải qua quy trình kiểm tra nghiêm ngặt trước khi đến tay khách hàng. Chúng tôi cung cấp bảo hành chính hãng 12 tháng và dịch vụ hậu mãi tận tâm.
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24}>
          <Divider />
          <div className="detailed-content" dangerouslySetInnerHTML={{ __html: additionalContent }} />
        </Col>
      </Row>
      
      {/* Thêm hình ảnh minh họa */}
      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} md={8}>
          <img 
            src={`/assets/images/products/${product.category}-detail1.jpg`} 
            alt={`${product.name} detail 1`}
            className="w-full rounded-lg shadow-md"
            onError={(e) => e.target.src = "/assets/images/products/watch.jpg"}
          />
        </Col>
        <Col xs={24} md={8}>
          <img 
            src={`/assets/images/products/${product.category}-detail2.jpg`}
            alt={`${product.name} detail 2`}
            className="w-full rounded-lg shadow-md"
            onError={(e) => e.target.src = "/assets/images/products/watch.jpg"}
          />
        </Col>
        <Col xs={24} md={8}>
          <img 
            src={`/assets/images/products/${product.category}-detail3.jpg`}
            alt={`${product.name} detail 3`}
            className="w-full rounded-lg shadow-md"
            onError={(e) => e.target.src = "/assets/images/products/watch.jpg"}
          />
        </Col>
      </Row>
      
      <style jsx>{`
        .detailed-content h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #333;
        }
        
        .detailed-content p {
          font-size: 1rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ProductDescription;