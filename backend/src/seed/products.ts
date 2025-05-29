import { Payload } from 'payload';

export const seedProducts = async (payload: Payload) => {
  console.log('🛍️ Đang tạo seed dữ liệu Products...');

  try {
    // Lấy categories và media đã seed trước đó
    const categories = await payload.find({
      collection: 'product-categories',
      limit: 100
    });

    const media = await payload.find({
      collection: 'media',
      limit: 100
    });

    // Tạo map để dễ tìm category và media by slug/filename
    const categoryMap = new Map(categories.docs.map(cat => [cat.slug, cat.id]));
    const mediaMap = new Map(media.docs.map(med => [med.filename, med.id]));

    // Data sản phẩm từ FEvrc
    const productsData = [
      {
        name: "Điều hòa công nghiệp VRC-5000",
        slug: "dieu-hoa-cong-nghiep-vrc-5000",
        excerpt: "Hệ thống điều hòa công nghiệp công suất lớn, phù hợp cho nhà xưởng, nhà máy sản xuất",
        categorySlug: "dieu-hoa-cong-nghiep",
        mediaFilename: "projects-overview.jpg",
        features: ["Công suất làm lạnh: 50.000 BTU", "Tiết kiệm điện năng 40%", "Vận hành êm ái", "Điều khiển thông minh từ xa"],
        specifications: [
          { name: "Công suất làm lạnh", value: "50.000 BTU/h" },
          { name: "Công suất điện tiêu thụ", value: "4.8kW" },
          { name: "Nguồn điện", value: "380V-415V/3Ph/50Hz" },
          { name: "Độ ồn", value: "55dB(A)" },
          { name: "Kích thước (DxRxC)", value: "1800x900x1950mm" },
          { name: "Khối lượng", value: "320kg" },
          { name: "Gas làm lạnh", value: "R410A" },
          { name: "Xuất xứ", value: "Việt Nam" }
        ],
        isNew: true,
        featured: true
      },
      {
        name: "Kho lạnh bảo quản VRC-KL500",
        slug: "kho-lanh-bao-quan-vrc-kl500",
        excerpt: "Kho lạnh công nghiệp lắp đặt nhanh chóng, bảo quản thực phẩm, dược phẩm với nhiệt độ ổn định",
        categorySlug: "kho-lanh",
        mediaFilename: "service-overview.jpg",
        features: ["Diện tích: 50-500m²", "Nhiệt độ: -30°C đến +20°C", "Panel cách nhiệt PU 100mm", "Hệ thống điều khiển tự động"],
        specifications: [
          { name: "Diện tích", value: "50-500m²" },
          { name: "Nhiệt độ làm việc", value: "-30°C đến +20°C" },
          { name: "Panel cách nhiệt", value: "PU 100mm" },
          { name: "Độ dày", value: "100mm" },
          { name: "Khối lượng panel", value: "12kg/m²" },
          { name: "Cửa kho lạnh", value: "Cửa trượt/cửa mở" },
          { name: "Hệ thống điều khiển", value: "Tự động, giám sát từ xa" },
          { name: "Xuất xứ", value: "Việt Nam" }
        ],
        isBestseller: true,
        featured: true
      },
      {
        name: "Máy làm lạnh nước công nghiệp VRC-Chiller",
        slug: "may-lam-lanh-nuoc-cong-nghiep-vrc-chiller",
        excerpt: "Hệ thống làm lạnh nước trung tâm cho nhà máy sản xuất, cao ốc văn phòng",
        categorySlug: "chiller",
        mediaFilename: "projects-overview.jpg",
        features: ["Công suất: 30-1000RT", "Hiệu suất năng lượng cao", "Vận hành ổn định", "Hệ thống khởi động mềm"],
        specifications: [
          { name: "Công suất làm lạnh", value: "30-1000RT" },
          { name: "Công suất tiêu thụ", value: "0.65kW/RT" },
          { name: "Gas làm lạnh", value: "R134a/R407C/R410A" },
          { name: "Nhiệt độ nước đầu ra", value: "5°C ~ 15°C" },
          { name: "Điện áp vận hành", value: "380V-415V/3Ph/50Hz" },
          { name: "Kiểu máy nén", value: "Scroll/Screw" },
          { name: "Hệ thống điều khiển", value: "Màn hình cảm ứng, kết nối BMS" },
          { name: "Xuất xứ", value: "Liên doanh Việt-Đức" }
        ],
        featured: false
      },
      {
        name: "Điều hòa dân dụng VRC Smart Inverter",
        slug: "dieu-hoa-dan-dung-vrc-smart-inverter",
        excerpt: "Điều hòa tiết kiệm năng lượng, thông minh cho gia đình và văn phòng nhỏ",
        categorySlug: "dieu-hoa-dan-dung",
        mediaFilename: "service-overview.jpg",
        features: ["Công nghệ Inverter", "Lọc không khí kháng khuẩn", "Kết nối WiFi", "Tiết kiệm điện đến 60%"],
        specifications: [
          { name: "Công suất làm lạnh", value: "9.000 - 24.000 BTU" },
          { name: "Chế độ", value: "Làm lạnh/Sưởi ấm" },
          { name: "Công nghệ", value: "DC Inverter" },
          { name: "Gas làm lạnh", value: "R32 thân thiện môi trường" },
          { name: "Hiệu suất năng lượng", value: "CSPF 5.8" },
          { name: "Độ ồn dàn lạnh", value: "18-36dB" },
          { name: "Kết nối", value: "WiFi, điều khiển qua smartphone" },
          { name: "Xuất xứ", value: "Việt Nam" }
        ],
        isNew: true,
        isBestseller: true,
        featured: true
      },
      {
        name: "Tháp giải nhiệt VRC-CT250",
        slug: "thap-giai-nhiet-vrc-ct250",
        excerpt: "Tháp giải nhiệt công nghiệp cho nhà máy sản xuất và hệ thống điều hòa trung tâm",
        categorySlug: "thiet-bi-phu-tro",
        mediaFilename: "projects-overview.jpg",
        features: ["Công suất: 50-1000RT", "Thiết kế chống ăn mòn", "Quạt tiết kiệm điện", "Dễ dàng bảo trì"],
        specifications: [
          { name: "Công suất giải nhiệt", value: "50-1000RT" },
          { name: "Vật liệu thân", value: "FRP chống ăn mòn" },
          { name: "Vật liệu tấm tản nhiệt", value: "PVC chống UV" },
          { name: "Năng lượng tiêu thụ", value: "0.03-0.05kW/RT" },
          { name: "Độ ồn", value: "65-75dB" },
          { name: "Trọng lượng hoạt động", value: "2000-25000kg" },
          { name: "Xuất xứ", value: "Việt Nam" }
        ],
        featured: false
      },
      {
        name: "Hệ thống thông gió VRC-Ventilation",
        slug: "he-thong-thong-gio-vrc-ventilation",
        excerpt: "Hệ thống thông gió và lọc không khí công nghiệp cho nhà xưởng, tòa nhà",
        categorySlug: "thiet-bi-phu-tro",
        mediaFilename: "service-overview.jpg",
        features: ["Lưu lượng: 1.000-100.000 m³/h", "Tiết kiệm năng lượng", "Điều khiển tự động", "Lọc không khí hiệu quả"],
        specifications: [
          { name: "Lưu lượng gió", value: "1.000-100.000 m³/h" },
          { name: "Áp suất tĩnh", value: "100-2000 Pa" },
          { name: "Công suất tiêu thụ", value: "0.75-75kW" },
          { name: "Vật liệu quạt", value: "Thép mạ kẽm/thép không gỉ" },
          { name: "Loại quạt", value: "Ly tâm/Hướng trục" },
          { name: "Lọc không khí", value: "G4, F7, HEPA (tùy chọn)" },
          { name: "Điều khiển", value: "Biến tần, cảm biến CO2, nhiệt độ" },
          { name: "Xuất xứ", value: "Việt Nam" }
        ],
        featured: false
      },
      {
        name: "Hệ thống VRV/VRF VRC-Multi",
        slug: "he-thong-vrv-vrf-vrc-multi",
        excerpt: "Hệ thống điều hòa đa cục, phù hợp cho các tòa nhà văn phòng, khách sạn, trung tâm thương mại",
        categorySlug: "dieu-hoa-thuong-mai",
        mediaFilename: "projects-overview.jpg",
        features: ["Điều khiển độc lập từng phòng", "Tiết kiệm năng lượng", "Vận hành êm ái", "Lắp đặt linh hoạt"],
        specifications: [
          { name: "Công suất làm lạnh", value: "8HP - 60HP" },
          { name: "Số dàn lạnh tối đa", value: "64 dàn" },
          { name: "Gas làm lạnh", value: "R410A" },
          { name: "Chiều dài đường ống tối đa", value: "165m" },
          { name: "Chênh lệch độ cao tối đa", value: "90m" },
          { name: "IPLV", value: "6.8" },
          { name: "Kết nối BMS", value: "LonWorks, BACnet, Modbus" },
          { name: "Xuất xứ", value: "Liên doanh Việt-Nhật" }
        ],
        isNew: true,
        featured: true
      },
      {
        name: "Hệ thống lọc bụi công nghiệp VRC-DustFilter",
        slug: "he-thong-loc-bui-cong-nghiep-vrc-dustfilter",
        excerpt: "Hệ thống lọc bụi và khí thải công nghiệp cho nhà máy sản xuất",
        categorySlug: "thiet-bi-phu-tro",
        mediaFilename: "service-overview.jpg",
        features: ["Hiệu suất lọc > 99%", "Tự động làm sạch", "Tuổi thọ cao", "Giám sát từ xa"],
        specifications: [
          { name: "Lưu lượng xử lý", value: "1.000-100.000 m³/h" },
          { name: "Hiệu suất lọc", value: ">99%" },
          { name: "Kích thước hạt lọc", value: "0.3-100 μm" },
          { name: "Áp suất tĩnh", value: "1500-3000 Pa" },
          { name: "Công suất tiêu thụ", value: "1.5-90kW" },
          { name: "Phương pháp làm sạch", value: "Khí nén/Cơ học" },
          { name: "Vật liệu lọc", value: "Polyester/PTFE" },
          { name: "Xuất xứ", value: "Việt Nam" }
        ],
        featured: false
      }
    ];

    const createdProducts = [];

    for (const productData of productsData) {
      // Kiểm tra product đã tồn tại
      const existing = await payload.find({
        collection: 'products',
        where: {
          slug: { equals: productData.slug }
        }
      });

      if (existing.docs.length > 0) {
        console.log(`🛍️ Product ${productData.name} đã tồn tại, bỏ qua...`);
        createdProducts.push(existing.docs[0]);
        continue;
      }

      // Lấy category ID
      const categoryId = categoryMap.get(productData.categorySlug);
      if (!categoryId) {
        console.warn(`⚠️ Không tìm thấy category: ${productData.categorySlug}`);
        continue;
      }

      // Lấy media ID
      const mediaId = mediaMap.get(productData.mediaFilename);
      if (!mediaId) {
        console.warn(`⚠️ Không tìm thấy media: ${productData.mediaFilename}`);
        continue;
      }

      try {        // Tạo rich text content cho description
        const description = {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: productData.excerpt,
                    version: 1
                  }
                ],
                version: 1
              }
            ],            direction: "ltr" as const,
            format: "" as const,
            indent: 0,
            version: 1
          }
        };

        const product = await payload.create({
          collection: 'products',
          data: {
            name: productData.name,
            slug: productData.slug,
            excerpt: productData.excerpt,
            description,
            mainImage: mediaId,
            category: categoryId,
            specifications: productData.specifications,
            featured: productData.featured || false,
            status: 'published'
          }
        });

        createdProducts.push(product);
        console.log(`✅ Đã tạo product: ${productData.name} (ID: ${product.id})`);
      } catch (createError) {
        console.error(`❌ Lỗi tạo product ${productData.name}:`, createError);
      }
    }

    console.log(`🛍️ Hoàn thành seed Products: ${createdProducts.length} sản phẩm`);    // Tạo related products sau khi tất cả products đã được tạo
    const validProducts = createdProducts.filter((p): p is NonNullable<typeof p> => p !== undefined);
    await createRelatedProducts(payload, validProducts);

    return createdProducts;

  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed Products:', error);
    throw error;
  }
};

// Function để tạo related products
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createRelatedProducts(payload: Payload, products: any[]) {
  console.log('🔗 Đang tạo related products...');

  // Logic để tạo related products
  const relatedProductsMap = {
    "dieu-hoa-cong-nghiep-vrc-5000": ["may-lam-lanh-nuoc-cong-nghiep-vrc-chiller", "thap-giai-nhiet-vrc-ct250"],
    "kho-lanh-bao-quan-vrc-kl500": ["may-lam-lanh-nuoc-cong-nghiep-vrc-chiller", "he-thong-thong-gio-vrc-ventilation"],
    "may-lam-lanh-nuoc-cong-nghiep-vrc-chiller": ["dieu-hoa-cong-nghiep-vrc-5000", "thap-giai-nhiet-vrc-ct250"],
    "dieu-hoa-dan-dung-vrc-smart-inverter": ["he-thong-vrv-vrf-vrc-multi"],
    "he-thong-vrv-vrf-vrc-multi": ["dieu-hoa-dan-dung-vrc-smart-inverter", "dieu-hoa-cong-nghiep-vrc-5000"]
  };

  const productMap = new Map(products.map(p => [p.slug, p.id]));

  for (const [productSlug, relatedSlugs] of Object.entries(relatedProductsMap)) {
    const productId = productMap.get(productSlug);
    if (!productId) continue;

    const relatedIds = relatedSlugs
      .map(slug => productMap.get(slug))
      .filter(id => id !== undefined);

    if (relatedIds.length > 0) {
      try {
        await payload.update({
          collection: 'products',
          id: productId,
          data: {
            relatedProducts: relatedIds
          }
        });
        console.log(`🔗 Đã cập nhật ${relatedIds.length} related products cho ${productSlug}`);
      } catch (error) {
        console.error(`❌ Lỗi cập nhật related products cho ${productSlug}:`, error);
      }
    }
  }

  console.log('🔗 Hoàn thành tạo related products');
}
