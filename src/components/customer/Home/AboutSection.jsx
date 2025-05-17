import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-10 bg-blue-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Về Watch Store</h2>
        <p className="text-lg mb-6">
          Chúng tôi là cửa hàng chuyên cung cấp các mẫu đồng hồ đeo tay chất lượng cao với thiết kế hiện đại và phong cách.
        </p>
        <p className="text-lg mb-6">
          Tại Watch Store, chúng tôi cam kết mang đến cho bạn những sản phẩm tốt nhất với dịch vụ khách hàng tận tâm.
        </p>
        <p className="text-lg mb-6">
          <strong>Slogan:</strong> "Thời gian quý giá, hãy để chúng tôi giúp bạn giữ gìn nó!"
        </p>
      </div>
    </section>
  );
};

export default AboutSection;