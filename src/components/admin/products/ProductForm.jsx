import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Row,
  Col,
  Space,
  Button,
  Image,
  Card,
  Divider,
  message,
  Tag,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  StarOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  validateImageFile,
  getBase64,
  uploadImage,
} from "../../../utils/imageUpload";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const ProductForm = ({
  visible,
  onCancel,
  onSubmit,
  product = null,
  categories = [],
  brands = [],
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isEdit = !!product;

  useEffect(() => {
    if (visible) {
      if (isEdit && product) {
        // Populate form with product data
        form.setFieldsValue({
          ...product,
          categoryId: product.category?.categoryId || product.categoryId,
          brandId: product.brand?.brandId || product.brandId,
          images: product.images || [],
        });

        // Set images
        const productImages = product.images || [];
        setImages(
          productImages.map((img, index) => ({
            uid: img.imageId || index,
            name: img.name || `image-${index}`,
            status: "done",
            url: img.imageUrl || img.url,
            isPrimary: img.isPrimary || index === 0,
          }))
        );
      } else {
        form.resetFields();
        setImages([]);
      }
    }
  }, [visible, isEdit, product, form]);

  const handleSubmit = async (values) => {
    try {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("sku", values.sku);
      fd.append("description", values.description || "");
      fd.append("price", values.price);
      fd.append("brandId", values.brandId);
      fd.append("categoryId", values.categoryId);
      fd.append("primaryImageIndex", images.findIndex((img) => img.isPrimary));

      images.forEach((img) => {
        const file = img.originFileObj;
        if (file) {
          fd.append("images", file);
        }
      });

      const res = await axios.post("http://localhost:8080/api/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Thêm sản phẩm thành công");
      onSubmit?.(res.data); // Nếu bạn có callback xử lý sau khi tạo
      handleCancel();
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Lỗi khi gửi dữ liệu");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImages([]);
    setPreviewImage("");
    setPreviewVisible(false);
    onCancel();
  };

  // Image upload handlers
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      if (!validateImageFile(file)) {
        onError("Invalid file");
        return;
      }

      setUploading(true);

      // Convert to base64 for preview
      const base64 = await getBase64(file);

      // Simulate upload
      const result = await uploadImage(file);

      const newImage = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url: result.url,
        originFileObj: file, // Giữ lại file gốc ở đây
        isPrimary: images.length === 0, // First image is primary
      };

      setImages((prev) => [...prev, newImage]);
      onSuccess(result, file);
    } catch (error) {
      message.error("Upload failed");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (file) => {
    setImages((prev) => {
      const newImages = prev.filter((img) => img.uid !== file.uid);
      // If removed image was primary, make first image primary
      if (file.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const handleSetPrimary = (targetUid) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.uid === targetUid,
      }))
    );
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  const handleUploadAll = async () => {
  if (images.length === 0) return;

  const fd = new FormData();
    images.forEach(img => {
      // img.originFileObj là File gốc từ ant-upload
      const file = img.originFileObj || img.file;
      if (file) fd.append('images[]', file);
    });

    // Gửi metadata nếu cần
    // fd.append('productName', form.getFieldValue('name'));

    try {
      console.log("Preparing to upload to backend:", fd);
      const res = await axios.post('http://localhost:8080/api/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Upload thành công');
      // Xử lý response, ví dụ: lưu các imageUrl trả về
      // setImages(res.data.images)
      onSubmit(res.data);
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error('Upload thất bại');
    }
  };

  return (
    <>
      <Modal
        title={isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        destroyOnClose
        className="product-form-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <Card title="Thông tin cơ bản" size="small">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tên sản phẩm"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên sản phẩm",
                        },
                        {
                          min: 3,
                          message: "Tên sản phẩm phải có ít nhất 3 ký tự",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="SKU"
                      name="sku"
                      rules={[{ required: true, message: "Vui lòng nhập SKU" }]}
                    >
                      <Input placeholder="VD: WS-001" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Mô tả"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả sản phẩm",
                        },
                      ]}
                    >
                      <TextArea
                        rows={3}
                        placeholder="Mô tả chi tiết về sản phẩm"
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Category & Brand */}
            <Col span={24}>
              <Card title="Phân loại" size="small">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Danh mục"
                      name="categoryId"
                      rules={[
                        { required: true, message: "Vui lòng chọn danh mục" },
                      ]}
                    >
                      <Select placeholder="Chọn danh mục">
                        {categories.map((category) => (
                          <Option
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Thương hiệu"
                      name="brandId"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn thương hiệu",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn thương hiệu">
                        {brands.map((brand) => (
                          <Option key={brand.brandId} value={brand.brandId}>
                            {brand.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Pricing & Inventory */}
            <Col span={24}>
              <Card title="Giá & Kho hàng" size="small">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Giá bán"
                      name="price"
                      rules={[
                        { required: true, message: "Vui lòng nhập giá bán" },
                        {
                          type: "number",
                          min: 0,
                          message: "Giá phải lớn hơn 0",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        addonAfter="₫"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Giá so sánh" name="comparePrice">
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        addonAfter="₫"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Số lượng tồn kho"
                      name="stockQuantity"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng" },
                        {
                          type: "number",
                          min: 0,
                          message: "Số lượng phải lớn hơn hoặc bằng 0",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} placeholder="0" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Trạng thái"
                      name="inStock"
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="Còn hàng"
                        unCheckedChildren="Hết hàng"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Kích hoạt"
                      name="isActive"
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="Đang bán"
                        unCheckedChildren="Ngừng bán"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Images */}
            <Col span={24}>
              <Card title="Hình ảnh sản phẩm" size="small">
               <Upload
                  listType="picture-card"
                  fileList={images}
                  onPreview={handlePreview}
                  onRemove={handleRemoveImage}
                  beforeUpload={file => {
                    setImages(prev => [
                      ...prev,
                      {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        originFileObj: file,
                        url: URL.createObjectURL(file),
                        isPrimary: prev.length === 0,
                      }
                    ]);
                    return false; // để Antd không auto upload
                  }}
                  multiple
                  accept="image/*"
                  showUploadList={false}
                >
                  {images.length >= 8 ? null : uploadButton}
                </Upload>

                {images.length > 0 && (
                  <div className="mt-4">
                    <Divider orientation="left" plain>
                      Danh sách hình ảnh ({images.length}/8)
                    </Divider>
                    <Row gutter={[16, 16]}>
                      {images.map((image) => (
                        <Col key={image.uid} xs={12} sm={8} md={6}>
                          <div className="relative border border-gray-200 rounded-lg p-2 hover:border-blue-400 transition-colors">
                            <Image
                              src={image.url}
                              alt={image.name}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                              }}
                              className="rounded"
                            />

                            {image.isPrimary && (
                              <Tag
                                color="gold"
                                className="absolute top-1 left-1"
                                icon={<StarOutlined />}
                              >
                                Chính
                              </Tag>
                            )}

                            <div className="absolute top-1 right-1">
                              <Space size="small">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() => handlePreview(image)}
                                  className="bg-white bg-opacity-80"
                                />
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemoveImage(image)}
                                  className="bg-white bg-opacity-80 text-red-500"
                                />
                              </Space>
                            </div>

                            {!image.isPrimary && (
                              <Button
                                type="link"
                                size="small"
                                onClick={() => handleSetPrimary(image.uid)}
                                className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-80 text-xs"
                              >
                                Đặt làm ảnh chính
                              </Button>
                            )}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <div className="text-right mt-6">
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || uploading}
                disabled={uploading}
              >
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title="Xem trước hình ảnh"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={600}
      >
        <Image src={previewImage} alt="preview" style={{ width: "100%" }} />
      </Modal>
    </>
  );
};

export default ProductForm;
