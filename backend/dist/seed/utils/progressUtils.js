"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressManager = void 0;
/**
 * Tiện ích quản lý progress bar cho quá trình seed data
 * Giúp hiển thị trực quan tiến trình upload và seed
 * Cập nhật để tương thích với môi trường Next.js
 */
const cli_progress_1 = __importDefault(require("cli-progress"));
const colors_1 = __importDefault(require("colors"));
// Kiểm tra xem môi trường có hỗ trợ cli-progress hay không
const isSupportedEnvironment = () => {
    try {
        // Trong một số môi trường như Next.js, process.stdout có thể bị ghi đè
        return process.stdout && typeof process.stdout.cursorTo === 'function';
    }
    catch (_e) {
        return false;
    }
};
// Singleton để quản lý progress bar
class ProgressManager {
    constructor() {
        this.progressBar = null;
        this.totalItems = 0;
        this.currentItems = 0;
        this.activeLabel = '';
        this.isSupported = isSupportedEnvironment();
        // Kiểm tra môi trường khi khởi tạo
        this.isSupported = isSupportedEnvironment();
    }
    static getInstance() {
        if (!ProgressManager.instance) {
            ProgressManager.instance = new ProgressManager();
        }
        return ProgressManager.instance;
    }
    /**
     * Khởi tạo progress bar với tổng số item cần xử lý
     *
     * @param total Tổng số item để hoàn thành
     * @param label Nhãn mô tả task
     */ initProgressBar(total, label = 'Seeding data') {
        if (this.progressBar) {
            this.progressBar.stop();
        }
        this.totalItems = total;
        this.currentItems = 0;
        this.activeLabel = label;
        // Kiểm tra môi trường trước khi tạo thanh tiến trình
        if (!this.isSupported) {
            console.log(`🚀 ${label} - Bắt đầu (${total} items)`);
            return;
        }
        try {
            const format = `${colors_1.default.cyan(label)} ${colors_1.default.yellow('[{bar}]')} ${colors_1.default.green('{percentage}%')} | ${colors_1.default.magenta('{value}/{total}')} | ${colors_1.default.blue('{duration_formatted}')}`;
            this.progressBar = new cli_progress_1.default.SingleBar({
                format,
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            }, cli_progress_1.default.Presets.shades_classic);
            this.progressBar.start(total, 0);
        }
        catch (_error) {
            // Fallback nếu có lỗi với thanh tiến trình
            console.log(`🚀 ${label} - Bắt đầu (${total} items)`);
            this.isSupported = false;
        }
    }
    /**
     * Cập nhật tiến trình
     *
     * @param increment Số item đã hoàn thành thêm
     */ increment(increment = 1) {
        this.currentItems += increment;
        // Nếu không hỗ trợ thanh tiến trình, hiển thị log thông thường
        if (!this.isSupported || !this.progressBar) {
            console.log(`⏩ ${this.activeLabel} - Tiến độ: ${this.currentItems}/${this.totalItems}`);
            return;
        }
        try {
            this.progressBar.update(this.currentItems);
        }
        catch (_error) {
            // Fallback nếu có lỗi
            console.log(`⏩ ${this.activeLabel} - Tiến độ: ${this.currentItems}/${this.totalItems}`);
            this.isSupported = false;
        }
    }
    /**
     * Hoàn thành và đóng progress bar
     */ complete() {
        // Nếu không hỗ trợ thanh tiến trình, hiển thị log thông thường
        if (!this.isSupported || !this.progressBar) {
            console.log(`✅ ${this.activeLabel} - Hoàn thành! (${this.totalItems}/${this.totalItems})`);
            return;
        }
        try {
            this.progressBar.update(this.totalItems);
            this.progressBar.stop();
            this.progressBar = null;
        }
        catch (_error) {
            // Fallback nếu có lỗi
            console.log(`✅ ${this.activeLabel} - Hoàn thành! (${this.totalItems}/${this.totalItems})`);
        }
    }
}
exports.progressManager = ProgressManager.getInstance();
