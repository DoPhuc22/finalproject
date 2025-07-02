import React from 'react';
import { Typography, Row, Col, Divider, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

const ProductDescription = ({ product }) => {
  const generateDetailedDescription = () => {
    const baseDescription = product.description;
    
    // Xác định danh mục
    let category = '';
    if (typeof product.category === 'object') {
      category = product.category.name?.toLowerCase();
    } else {
      category = product.category?.toLowerCase();
    }
    
    // Mô tả thêm dựa trên loại đồng hồ
    let additionalContent = '';
    
    // switch (category) {
    //   case 'mechanical':
    //   case 'cơ':
    //     additionalContent = `
    //       <h3>Bộ máy cơ chính xác</h3>
    //       <p>Đồng hồ ${product.name} được trang bị bộ máy cơ tự động (Automatic) với công nghệ tiên tiến. Bộ máy này hoạt động thông qua chuyển động của cổ tay người đeo, không cần pin, mang lại độ chính xác cao và tuổi thọ lâu dài. Với nhiều chân kính và khả năng dự trữ năng lượng, đồng hồ luôn sẵn sàng đồng hành cùng bạn trong mọi hoạt động.</p>
          
    //       <h3>Thiết kế sang trọng</h3>
    //       <p>Với thiết kế linh hoạt, ${product.name} là lựa chọn hoàn hảo cho cả trang phục công sở lẫn những buổi gặp gỡ thân mật. Dây đeo cao cấp không chỉ tạo cảm giác thoải mái mà còn dễ dàng kết hợp với nhiều phong cách thời trang khác nhau.</p>
    //     `;
    //     break;
        
    //   case 'sport':
    //   case 'thể thao':
    //     additionalContent = `
    //       <h3>Chức năng thể thao đa dạng</h3>
    //       <p>Được trang bị đầy đủ các tính năng như bấm giờ, đồng hồ bấm giờ, đèn nền, ${product.name} hỗ trợ tối đa cho các hoạt động thể thao và ngoài trời. Độ chính xác cao và dễ đọc trong mọi điều kiện ánh sáng giúp bạn luôn kiểm soát được thời gian.</p>
          
    //       <h3>Độ bền vượt trội</h3>
    //       <p>${product.name} được thiết kế để chịu được các tác động mạnh trong quá trình luyện tập và thi đấu. Khả năng chống nước tốt, kính sapphire chống trầy xước và vỏ bằng vật liệu bền bỉ giúp đồng hồ luôn trong tình trạng hoàn hảo dù bạn đi bơi, chạy bộ hay leo núi.</p>
    //     `;
    //     break;
        
    //   case 'smart':
    //   case 'thông minh':
    //     additionalContent = `
    //       <h3>Công nghệ hiện đại</h3>
    //       <p>${product.name} không chỉ là một thiết bị đo thời gian mà còn là trợ lý cá nhân thông minh trên cổ tay của bạn. Kết nối Bluetooth với điện thoại di động, đồng hồ cho phép bạn nhận thông báo, tin nhắn, cuộc gọi mà không cần lấy điện thoại ra.</p>
          
    //       <h3>Theo dõi sức khỏe toàn diện</h3>
    //       <p>Được trang bị nhiều cảm biến tiên tiến, đồng hồ có thể theo dõi nhịp tim, mức độ oxy trong máu (SpO2), chất lượng giấc ngủ và nhiều chỉ số sức khỏe khác. Các thuật toán thông minh phân tích dữ liệu và đưa ra các gợi ý để cải thiện sức khỏe của bạn.</p>
          
    //       <h3>Kết nối không giới hạn</h3>
    //       <p>Tích hợp nhiều ứng dụng hữu ích và hỗ trợ tải thêm từ kho ứng dụng, ${product.name} có thể tùy chỉnh theo nhu cầu sử dụng của từng người. Bạn có thể nghe nhạc, thanh toán không tiếp xúc, điều khiển thiết bị thông minh trong nhà và nhiều tính năng khác.</p>
    //     `;
    //     break;
        
    //   case 'classic':
    //   case 'cổ điển':
    //   default:
    //     additionalContent = `
    //       <h3>Vẻ đẹp vượt thời gian</h3>
    //       <p>${product.name} không chỉ là một thiết bị đo thời gian mà còn là biểu tượng của phong cách và đẳng cấp. Thiết kế cổ điển với các chi tiết hiện đại tạo nên sự hài hòa hoàn hảo, phù hợp với cả trang phục công sở lẫn những dịp trang trọng.</p>
          
    //       <h3>Chất lượng hoàn hảo</h3>
    //       <p>Mỗi chi tiết của ${product.name} đều được chế tác tỉ mỉ từ các vật liệu cao cấp. Mặt kính sapphire chống trầy xước, vỏ bằng thép không gỉ 316L và dây đeo được làm từ da bò Ý đều đảm bảo độ bền và vẻ đẹp lâu dài cho sản phẩm.</p>
    //     `;
    // }
    
    return { baseDescription, additionalContent };
  };
  
  const { baseDescription, additionalContent } = generateDetailedDescription();

  // Các đặc điểm nổi bật (tùy thuộc vào loại đồng hồ)
  const highlights = [
    'Thiết kế thời trang, sang trọng',
    'Chất liệu cao cấp, bền bỉ',
    'Độ chính xác cao',
    'Chống nước hiệu quả',
    'Bảo hành chính hãng 12 tháng'
  ];

  return (
    <div className="product-description py-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Title level={4}>Mô tả sản phẩm</Title>
          <Paragraph>
            {baseDescription || `${product.name} là sản phẩm đồng hồ cao cấp với thiết kế tinh tế và tính năng hiện đại. Phù hợp với nhiều đối tượng khách hàng và nhiều mục đích sử dụng khác nhau.`}
          </Paragraph>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="Đặc điểm nổi bật" bordered={false} className="bg-gray-50">
            <ul className="pl-5">
              {highlights.map((highlight, index) => (
                <li key={index} className="mb-2">{highlight}</li>
              ))}
            </ul>
          </Card>
        </Col>
        
        <Col xs={24}>
          <Card bordered={false} className="bg-gray-50 mt-4">
            <Title level={5}>Chính sách bảo hành</Title>
            <Paragraph>
              Mỗi chiếc đồng hồ đều trải qua quy trình kiểm tra nghiêm ngặt trước khi đến tay khách hàng. Chúng tôi cung cấp bảo hành chính hãng 12 tháng và dịch vụ hậu mãi tận tâm.
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24}>
          <Divider />
          <div className="detailed-content" dangerouslySetInnerHTML={{ __html: additionalContent }} />
        </Col>
      </Row>
    </div>
  );
};

export default ProductDescription;