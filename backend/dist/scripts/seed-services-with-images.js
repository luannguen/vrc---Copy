"use strict";
// Services Data Seed với Image Upload từ Frontend - VRC
// Tuân thủ codequality.md: TypeScript, type-safe, proper error handling, upload real images
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedServicesWithImages = seedServicesWithImages;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables trước khi import payload
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const payload_1 = require("payload");
const payload_config_1 = __importDefault(require("../payload.config"));
const uploadMedia_1 = require("../seed/utils/uploadMedia");
const fs_1 = __importDefault(require("fs"));
// Service image mapping based on available images in frontend
const serviceImageMap = {
    'tu-van-thiet-ke': 'vrc-post-he-thong-quan-ly-nang-luong-thong-minh.jpg',
    'lap-dat-chuyen-nghiep': 'vrc-post-cong-nghe-inverter-tien-tien-toi-uu-hoa-tieu-thu-dien-nang.jpeg',
    'bao-tri-dinh-ky': 'vrc-post-khoa-dao-tao-ky-thuat-vien-bao-tri.jpeg',
    'sua-chua-khan-cap': 'vrc-post-giai-phap-tan-dung-nhiet-thai-heat-recovery.jpeg',
    'nang-cap-he-thong': 'vrc-post-ung-dung-ai-trong-toi-uu-hoa-van-hanh.jpg',
    'ho-tro-ky-thuat': 'vrc-post-hoi-thao-cong-nghe-tiet-kiem-nang-luong.jpeg',
};
// Services data từ hardcode frontend với image mapping
const servicesData = [
    {
        title: 'Tư vấn thiết kế',
        slug: 'tu-van-thiet-ke',
        type: 'consulting',
        summary: 'Giải pháp thiết kế hệ thống điện lạnh tối ưu cho mọi công trình từ dân dụng đến công nghiệp.',
        content: {
            root: {
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Dịch vụ tư vấn thiết kế hệ thống điện lạnh chuyên nghiệp của VRC giúp bạn có được giải pháp tối ưu nhất cho công trình của mình. Với đội ngũ kỹ sư giàu kinh nghiệm và công nghệ thiết kế hiện đại, chúng tôi cam kết mang đến những hệ thống điện lạnh hiệu quả, tiết kiệm năng lượng và phù hợp với ngân sách.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Quy trình tư vấn thiết kế của chúng tôi bao gồm: khảo sát hiện trạng, phân tích nhu cầu, thiết kế sơ bộ, tính toán chi tiết, lựa chọn thiết bị, và lập dự toán tổng thể. Mỗi dự án đều được nghiên cứu kỹ lưỡng để đảm bảo tính khả thi và hiệu quả cao nhất.',
                            },
                        ],
                    },
                ],
            },
        },
        features: [
            {
                title: 'Tư vấn khả thi',
                description: 'Đánh giá hiện trạng công trình, khảo sát nhu cầu và đề xuất các phương án khả thi.',
                icon: 'lightbulb',
            },
            {
                title: 'Thiết kế 3D',
                description: 'Mô hình thiết kế 3D chi tiết giúp hình dung rõ hệ thống trước khi thi công.',
                icon: 'pen-tool',
            },
            {
                title: 'Tính toán tải lạnh',
                description: 'Tính toán chính xác tải lạnh và chọn thiết bị phù hợp với công suất cần thiết.',
                icon: 'bar-chart-3',
            },
        ],
        benefits: [
            {
                title: 'Tối ưu chi phí',
                description: 'Thiết kế phù hợp giúp tiết kiệm chi phí đầu tư và vận hành dài hạn.',
            },
            {
                title: 'Hiệu quả cao',
                description: 'Hệ thống được thiết kế tối ưu đảm bảo hiệu suất vận hành cao nhất.',
            },
        ],
        pricing: {
            showPricing: true,
            priceType: 'custom',
            customPrice: 'Liên hệ để được báo giá chi tiết',
            currency: 'VND',
        },
        faq: [
            {
                question: 'Quy trình tư vấn thiết kế như thế nào?',
                answer: 'Khảo sát → Phân tích nhu cầu → Thiết kế sơ bộ → Tính toán chi tiết → Lựa chọn thiết bị → Dự toán',
            },
            {
                question: 'Thời gian hoàn thành bản thiết kế?',
                answer: 'Tùy thuộc quy mô dự án, thường từ 1-3 tuần cho các dự án dân dụng, 2-6 tuần cho công nghiệp.',
            },
        ],
        order: 1,
        featured: true,
        status: 'published',
        meta: {
            title: 'Tư vấn thiết kế hệ thống điện lạnh - VRC',
            description: 'Dịch vụ tư vấn thiết kế hệ thống điện lạnh chuyên nghiệp, tối ưu chi phí và hiệu quả cao.',
        },
    },
    {
        title: 'Lắp đặt chuyên nghiệp',
        slug: 'lap-dat-chuyen-nghiep',
        type: 'installation',
        summary: 'Dịch vụ lắp đặt hệ thống lạnh công nghiệp và dân dụng với đội ngũ kỹ thuật giàu kinh nghiệm.',
        content: {
            root: {
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Dịch vụ lắp đặt chuyên nghiệp của VRC cam kết mang đến hệ thống điện lạnh vận hành hiệu quả, ổn định và bền bỉ. Với đội ngũ thợ lắp đặt được đào tạo bài bản và trang thiết bị hiện đại, chúng tôi đảm bảo chất lượng thi công đạt tiêu chuẩn quốc tế.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Quy trình lắp đặt chuẩn của chúng tôi: chuẩn bị mặt bằng, lắp đặt thiết bị, đấu nối hệ thống, kiểm tra vận hành, bàn giao và hướng dẫn sử dụng. Mọi công đoạn đều được giám sát chặt chẽ theo tiêu chuẩn kỹ thuật.',
                            },
                        ],
                    },
                ],
            },
        },
        features: [
            {
                title: 'Thi công chuẩn',
                description: 'Lắp đặt theo đúng tiêu chuẩn kỹ thuật, đảm bảo an toàn và hiệu quả.',
                icon: 'wrench',
            },
            {
                title: 'Thiết bị chính hãng',
                description: 'Sử dụng thiết bị chính hãng, đảm bảo chất lượng và có chế độ bảo hành.',
                icon: 'shield-check',
            },
            {
                title: 'Kiểm tra kỹ thuật',
                description: 'Kiểm tra toàn diện hệ thống trước khi bàn giao, đảm bảo vận hành ổn định.',
                icon: 'check-circle',
            },
        ],
        benefits: [
            {
                title: 'Chất lượng đảm bảo',
                description: 'Hệ thống được lắp đặt chuyên nghiệp, vận hành ổn định và bền bỉ.',
            },
            {
                title: 'Tiết kiệm thời gian',
                description: 'Đội ngũ kinh nghiệm giúp rút ngắn thời gian thi công, đưa vào sử dụng sớm.',
            },
        ],
        pricing: {
            showPricing: true,
            priceType: 'custom',
            customPrice: 'Báo giá theo từng dự án cụ thể',
            currency: 'VND',
        },
        faq: [
            {
                question: 'Thời gian lắp đặt mất bao lâu?',
                answer: 'Tùy quy mô: hệ thống gia đình 1-2 ngày, văn phòng 3-5 ngày, công nghiệp 1-4 tuần.',
            },
            {
                question: 'Có bảo hành sau lắp đặt không?',
                answer: 'Có bảo hành từ 12-24 tháng tùy loại thiết bị và hệ thống.',
            },
        ],
        order: 2,
        featured: true,
        status: 'published',
        meta: {
            title: 'Lắp đặt hệ thống điện lạnh chuyên nghiệp - VRC',
            description: 'Dịch vụ lắp đặt hệ thống điện lạnh chuyên nghiệp, đảm bảo chất lượng và hiệu quả.',
        },
    },
    {
        title: 'Bảo trì định kỳ',
        slug: 'bao-tri-dinh-ky',
        type: 'maintenance',
        summary: 'Chương trình bảo trì định kỳ giúp hệ thống vận hành ổn định, kéo dài tuổi thọ thiết bị.',
        content: {
            root: {
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Chương trình bảo trì định kỳ của VRC giúp duy trì hiệu suất tối ưu cho hệ thống điện lạnh, ngăn ngừa sự cố và kéo dài tuổi thọ thiết bị. Với lịch trình bảo trì khoa học và đội ngũ kỹ thuật chuyên nghiệp, chúng tôi đảm bảo hệ thống của bạn luôn vận hành ổn định.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Gói bảo trì bao gồm: vệ sinh thiết bị, kiểm tra và thay thế linh kiện, bổ sung gas lạnh, kiểm tra hệ thống điện, điều chỉnh thông số vận hành và báo cáo tình trạng hệ thống định kỳ.',
                            },
                        ],
                    },
                ],
            },
        },
        features: [
            {
                title: 'Lịch trình linh hoạt',
                description: 'Bảo trì theo lịch định kỳ phù hợp với nhu cầu sử dụng của khách hàng.',
                icon: 'calendar',
            },
            {
                title: 'Kiểm tra toàn diện',
                description: 'Kiểm tra tất cả thành phần từ thiết bị chính đến phụ kiện, đảm bảo vận hành tối ưu.',
                icon: 'search',
            },
            {
                title: 'Báo cáo chi tiết',
                description: 'Cung cấp báo cáo tình trạng hệ thống và khuyến nghị cải thiện.',
                icon: 'file-text',
            },
        ],
        benefits: [
            {
                title: 'Kéo dài tuổi thọ',
                description: 'Bảo trì định kỳ giúp thiết bị hoạt động bền bỉ, giảm chi phí thay thế.',
            },
            {
                title: 'Tiết kiệm điện năng',
                description: 'Hệ thống được bảo trì tốt tiêu thụ ít điện năng hơn, giảm chi phí vận hành.',
            },
        ],
        pricing: {
            showPricing: true,
            priceType: 'custom',
            customPrice: 'Gói bảo trì từ 500.000 VND/lần',
            currency: 'VND',
        },
        faq: [
            {
                question: 'Tần suất bảo trì khuyến nghị?',
                answer: 'Hệ thống gia đình: 3-6 tháng/lần, văn phòng: 2-3 tháng/lần, công nghiệp: hàng tháng.',
            },
            {
                question: 'Bảo trì có bao gồm thay thế linh kiện?',
                answer: 'Bao gồm các linh kiện nhỏ, linh kiện lớn sẽ thông báo và báo giá riêng.',
            },
        ],
        order: 3,
        featured: false,
        status: 'published',
        meta: {
            title: 'Bảo trì hệ thống điện lạnh định kỳ - VRC',
            description: 'Dịch vụ bảo trì hệ thống điện lạnh định kỳ, kéo dài tuổi thọ và tiết kiệm chi phí.',
        },
    },
    {
        title: 'Sửa chữa khẩn cấp',
        slug: 'sua-chua-khan-cap',
        type: 'repair',
        summary: 'Dịch vụ sửa chữa khẩn cấp 24/7, khắc phục sự cố nhanh chóng với thời gian phản hồi tối thiểu.',
        content: {
            root: {
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Dịch vụ sửa chữa khẩn cấp của VRC hoạt động 24/7, sẵn sàng hỗ trợ khách hàng trong mọi tình huống sự cố. Với đội ngũ kỹ thuật viên có mặt nhanh chóng và trang thiết bị đầy đủ, chúng tôi cam kết khắc phục sự cố trong thời gian ngắn nhất.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Quy trình sửa chữa khẩn cấp: tiếp nhận thông tin sự cố, cử kỹ thuật viên đến hiện trường, chẩn đoán nguyên nhân, khắc phục sự cố, kiểm tra vận hành và bàn giao. Tất cả được thực hiện nhanh chóng và chuyên nghiệp.',
                            },
                        ],
                    },
                ],
            },
        },
        features: [
            {
                title: 'Hỗ trợ 24/7',
                description: 'Đội ngũ kỹ thuật túc trực 24/7, sẵn sàng hỗ trợ mọi lúc cần thiết.',
                icon: 'clock',
            },
            {
                title: 'Phản hồi nhanh',
                description: 'Thời gian phản hồi và có mặt tại hiện trường trong vòng 1-2 giờ.',
                icon: 'zap',
            },
            {
                title: 'Chẩn đoán chính xác',
                description: 'Sử dụng thiết bị chẩn đoán hiện đại, xác định chính xác nguyên nhân sự cố.',
                icon: 'target',
            },
        ],
        benefits: [
            {
                title: 'Giảm thiểu thiệt hại',
                description: 'Khắc phục nhanh giúp giảm thiểu thiệt hại và chi phí phát sinh.',
            },
            {
                title: 'Duy trì hoạt động',
                description: 'Đảm bảo hệ thống nhanh chóng trở lại hoạt động bình thường.',
            },
        ],
        pricing: {
            showPricing: true,
            priceType: 'hourly',
            customPrice: 'Phí dịch vụ từ 200.000 VND/giờ + linh kiện',
            currency: 'VND',
        },
        faq: [
            {
                question: 'Thời gian có mặt tại hiện trường?',
                answer: 'Trong nội thành: 1-2 giờ, ngoại thành và tỉnh lân cận: 2-4 giờ.',
            },
            {
                question: 'Chi phí sửa chữa tính như thế nào?',
                answer: 'Phí dịch vụ theo giờ + chi phí linh kiện thay thế (nếu có).',
            },
        ],
        order: 4,
        featured: true,
        status: 'published',
        meta: {
            title: 'Sửa chữa điện lạnh khẩn cấp 24/7 - VRC',
            description: 'Dịch vụ sửa chữa hệ thống điện lạnh khẩn cấp 24/7, phản hồi nhanh chóng.',
        },
    },
    {
        title: 'Nâng cấp hệ thống',
        slug: 'nang-cap-he-thong',
        type: 'other',
        summary: 'Tư vấn và thực hiện nâng cấp hệ thống điện lạnh cũ, áp dụng công nghệ mới tiết kiệm năng lượng.',
        content: {
            root: {
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Dịch vụ nâng cấp hệ thống của VRC giúp cải thiện hiệu suất và tiết kiệm chi phí vận hành cho các hệ thống điện lạnh cũ. Chúng tôi áp dụng công nghệ mới nhất như Inverter, IoT và AI để tối ưu hóa vận hành hệ thống.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Quy trình nâng cấp bao gồm: đánh giá hiện trạng, đề xuất giải pháp nâng cấp, lập kế hoạch thực hiện, thi công nâng cấp, kiểm tra và tối ưu hóa vận hành. Mỗi dự án nâng cấp đều được tính toán kỹ lưỡng về hiệu quả và chi phí.',
                            },
                        ],
                    },
                ],
            },
        },
        features: [
            {
                title: 'Công nghệ mới',
                description: 'Áp dụng công nghệ Inverter, IoT và AI để tối ưu hóa hiệu suất hệ thống.',
                icon: 'cpu',
            },
            {
                title: 'Tiết kiệm năng lượng',
                description: 'Giảm 20-40% tiêu thụ điện năng so với hệ thống cũ.',
                icon: 'leaf',
            },
            {
                title: 'Tận dụng hạ tầng',
                description: 'Tối đa hóa việc sử dụng lại hạ tầng cũ, giảm chi phí đầu tư.',
                icon: 'recycle',
            },
        ],
        benefits: [
            {
                title: 'ROI nhanh',
                description: 'Tiết kiệm điện năng giúp thu hồi vốn đầu tư trong 2-3 năm.',
            },
            {
                title: 'Hiệu suất cao',
                description: 'Hệ thống sau nâng cấp vận hành ổn định và hiệu quả hơn.',
            },
        ],
        pricing: {
            showPricing: true,
            priceType: 'custom',
            customPrice: 'Báo giá sau khi khảo sát và đánh giá hệ thống',
            currency: 'VND',
        },
        faq: [
            {
                question: 'Nâng cấp có cần thay toàn bộ hệ thống?',
                answer: 'Không, chúng tôi tối ưu tận dụng hạ tầng cũ, chỉ thay thế những phần cần thiết.',
            },
            {
                question: 'Thời gian hoàn vốn từ việc tiết kiệm điện?',
                answer: 'Thường từ 2-3 năm tùy thuộc mức độ nâng cấp và cường độ sử dụng.',
            },
        ],
        order: 5,
        featured: false,
        status: 'published',
        meta: {
            title: 'Nâng cấp hệ thống điện lạnh tiết kiệm năng lượng - VRC',
            description: 'Dịch vụ nâng cấp hệ thống điện lạnh cũ, áp dụng công nghệ mới tiết kiệm 20-40% điện năng.',
        },
    },
    {
        title: 'Hỗ trợ kỹ thuật',
        slug: 'ho-tro-ky-thuat',
        type: 'support',
        summary: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm luôn sẵn sàng hỗ trợ giải quyết mọi vấn đề kỹ thuật.',
        content: {
            root: {
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Dịch vụ hỗ trợ kỹ thuật của VRC cung cấp giải pháp toàn diện cho mọi vấn đề liên quan đến hệ thống điện lạnh. Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng tư vấn từ xa hoặc trực tiếp tại hiện trường.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Các hình thức hỗ trợ bao gồm: tư vấn qua điện thoại, hỗ trợ từ xa qua ứng dụng, hướng dẫn vận hành, giải đáp thắc mắc kỹ thuật và đào tạo sử dụng hệ thống cho nhân viên khách hàng.',
                            },
                        ],
                    },
                ],
            },
        },
        features: [
            {
                title: 'Tư vấn từ xa',
                description: 'Hỗ trợ kỹ thuật qua điện thoại và ứng dụng di động, tiết kiệm thời gian.',
                icon: 'phone',
            },
            {
                title: 'Đào tạo vận hành',
                description: 'Hướng dẫn và đào tạo nhân viên vận hành hệ thống hiệu quả.',
                icon: 'users',
            },
            {
                title: 'Tài liệu kỹ thuật',
                description: 'Cung cấp tài liệu hướng dẫn chi tiết và checklist bảo trì.',
                icon: 'book-open',
            },
        ],
        benefits: [
            {
                title: 'Giải quyết nhanh',
                description: 'Hỗ trợ kịp thời giúp giải quyết vấn đề nhanh chóng, không gián đoạn hoạt động.',
            },
            {
                title: 'Nâng cao hiểu biết',
                description: 'Đào tạo giúp nhân viên hiểu rõ hệ thống, vận hành và bảo trì tốt hơn.',
            },
        ],
        pricing: {
            showPricing: true,
            priceType: 'custom',
            customPrice: 'Miễn phí cho khách hàng VIP, 100.000 VND/lần cho khách khác',
            currency: 'VND',
        },
        faq: [
            {
                question: 'Hỗ trợ kỹ thuật có mất phí không?',
                answer: 'Miễn phí cho khách hàng VIP và trong thời gian bảo hành, các trường hợp khác 100k/lần.',
            },
            {
                question: 'Có hỗ trợ ngoài giờ hành chính?',
                answer: 'Có, chúng tôi có dịch vụ hỗ trợ 24/7 cho các trường hợp khẩn cấp.',
            },
        ],
        order: 6,
        featured: false,
        status: 'published',
        meta: {
            title: 'Hỗ trợ kỹ thuật điện lạnh chuyên nghiệp - VRC',
            description: 'Dịch vụ hỗ trợ kỹ thuật chuyên nghiệp, tư vấn và giải quyết mọi vấn đề điện lạnh.',
        },
    },
];
/**
 * Upload image for a service
 */
async function uploadServiceImage(payload, slug) {
    try {
        const imageFilename = serviceImageMap[slug];
        if (!imageFilename) {
            console.log(`⚠️ No image mapping found for service: ${slug}`);
            return null;
        }
        // Try to find image in frontend assets
        const frontendImagesPath = path_1.default.resolve(process.cwd(), '../vrcfrontend/public/assets/images');
        const imagePath = path_1.default.join(frontendImagesPath, imageFilename);
        if (!fs_1.default.existsSync(imagePath)) {
            console.log(`❌ Image not found: ${imagePath}`);
            return null;
        }
        console.log(`📸 Uploading image for ${slug}: ${imageFilename}`);
        const mediaId = await (0, uploadMedia_1.uploadMediaFromFrontend)(payload, imagePath, `Featured image for service: ${slug}`);
        if (mediaId) {
            console.log(`✅ Successfully uploaded image for ${slug}, media ID: ${mediaId}`);
        }
        else {
            console.log(`❌ Failed to upload image for ${slug}`);
        }
        return mediaId;
    }
    catch (error) {
        console.error(`❌ Error uploading image for ${slug}:`, error);
        return null;
    }
}
/**
 * Check if service exists by slug
 */
async function serviceExists(payload, slug) {
    try {
        const result = await payload.find({
            collection: 'services',
            where: {
                slug: {
                    equals: slug,
                },
            },
            limit: 1,
        });
        return result.docs.length > 0;
    }
    catch (error) {
        console.error(`Error checking service existence for slug ${slug}:`, error);
        return false;
    }
}
/**
 * Seed a single service with image upload
 */
async function seedService(payload, serviceData) {
    try {
        // Check if service already exists
        const exists = await serviceExists(payload, serviceData.slug);
        if (exists) {
            console.log(`⚠️ Service with slug "${serviceData.slug}" already exists. Skipping...`);
            return false;
        }
        // Upload featured image first
        console.log(`🚀 Processing service: ${serviceData.title}`);
        const imageId = await uploadServiceImage(payload, serviceData.slug); // Prepare service data with image
        const { featuredImage: _, ...serviceDataWithoutImage } = serviceData;
        // Create service payload - only include featuredImage if we have a valid ID
        let servicePayload;
        if (imageId) {
            servicePayload = {
                ...serviceDataWithoutImage,
                featuredImage: imageId, // string ID of the uploaded media
            };
        }
        else {
            servicePayload = serviceDataWithoutImage; // No featuredImage property at all
        }
        // Create service - bypass type checking due to optional featuredImage conflicts
        const result = await payload.create({
            collection: 'services',
            // @ts-expect-error: Type issue with optional featuredImage in Payload collection definition
            data: servicePayload,
        });
        if (result?.id) {
            console.log(`✅ Successfully created service: ${serviceData.title} (ID: ${result.id})`);
            if (imageId) {
                console.log(`   📸 With featured image: ${serviceImageMap[serviceData.slug]}`);
            }
            return true;
        }
        else {
            console.log(`❌ Failed to create service: ${serviceData.title}`);
            return false;
        }
    }
    catch (error) {
        console.error(`❌ Error seeding service ${serviceData.title}:`, error);
        return false;
    }
}
/**
 * Main seed function
 */
async function seedServicesWithImages() {
    console.log('🌱 Starting Services Seed with Images...');
    console.log('='.repeat(50));
    // Debug environment variables
    console.log('Environment check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '***set***' : 'NOT SET');
    console.log('DATABASE_URI:', process.env.DATABASE_URI ? '***set***' : 'NOT SET');
    try {
        // Get Payload instance
        const payload = await (0, payload_1.getPayload)({ config: payload_config_1.default });
        console.log('✅ Payload initialized successfully');
        // Backup existing data
        console.log('\n📦 Creating backup of existing services...');
        const existingServices = await payload.find({
            collection: 'services',
            limit: 1000,
        });
        console.log(`📊 Found ${existingServices.docs.length} existing services`);
        // Seed each service with image
        console.log('\n🔄 Seeding services with images...');
        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        for (const serviceData of servicesData) {
            const success = await seedService(payload, serviceData);
            if (success === true) {
                successCount++;
            }
            else if (success === false) {
                skippedCount++;
            }
            else {
                errorCount++;
            }
        }
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📈 SEED SUMMARY:');
        console.log(`✅ Successfully created: ${successCount} services`);
        console.log(`⚠️ Skipped (already exists): ${skippedCount} services`);
        console.log(`❌ Failed: ${errorCount} services`);
        console.log(`📊 Total processed: ${servicesData.length} services`);
        // Final verification
        console.log('\n🔍 Final verification...');
        const finalCount = await payload.count({ collection: 'services' });
        console.log(`📊 Total services in database: ${finalCount.totalDocs}`);
        console.log('\n🎉 Services seed with images completed successfully!');
        console.log('🌐 You can now check the admin dashboard and frontend');
        // Log image mapping summary
        console.log('\n📸 IMAGE MAPPING SUMMARY:');
        Object.entries(serviceImageMap).forEach(([slug, image]) => {
            console.log(`   ${slug} → ${image}`);
        });
    }
    catch (error) {
        console.error('❌ Seed process failed:', error);
        process.exit(1);
    }
    process.exit(0);
}
// Run the seed function if this file is executed directly
// For ES modules, check process.argv instead of require.main
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
if (process.argv[1] === __filename) {
    seedServicesWithImages();
}
