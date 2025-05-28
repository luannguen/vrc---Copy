/**
 * Tiện ích quản lý progress bar cho quá trình seed data
 * Giúp hiển thị trực quan tiến trình upload và seed
 * Cập nhật để tương thích với môi trường Next.js
 */
import cliProgress from 'cli-progress';
import colors from 'colors';

// Kiểm tra xem môi trường có hỗ trợ cli-progress hay không
const isSupportedEnvironment = () => {
  try {
    // Trong một số môi trường như Next.js, process.stdout có thể bị ghi đè
    return process.stdout && typeof process.stdout.cursorTo === 'function';
  } catch (_e) {
    return false;
  }
};

// Singleton để quản lý progress bar
class ProgressManager {
  private static instance: ProgressManager;
  private progressBar: cliProgress.SingleBar | null = null;
  private totalItems: number = 0;
  private currentItems: number = 0;
  private activeLabel: string = '';  private isSupported: boolean = isSupportedEnvironment();
  
  private constructor() {
    // Kiểm tra môi trường khi khởi tạo
    this.isSupported = isSupportedEnvironment();
  }
  
  public static getInstance(): ProgressManager {
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
   */  public initProgressBar(total: number, label: string = 'Seeding data'): void {
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
      const format = `${colors.cyan(label)} ${colors.yellow('[{bar}]')} ${colors.green('{percentage}%')} | ${colors.magenta('{value}/{total}')} | ${colors.blue('{duration_formatted}')}`;
      
      this.progressBar = new cliProgress.SingleBar({
        format,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      }, cliProgress.Presets.shades_classic);
        this.progressBar.start(total, 0);
    } catch (_error) {
      // Fallback nếu có lỗi với thanh tiến trình
      console.log(`🚀 ${label} - Bắt đầu (${total} items)`);
      this.isSupported = false;
    }
  }
  
  /**
   * Cập nhật tiến trình
   * 
   * @param increment Số item đã hoàn thành thêm
   */  public increment(increment: number = 1): void {
    this.currentItems += increment;
    
    // Nếu không hỗ trợ thanh tiến trình, hiển thị log thông thường
    if (!this.isSupported || !this.progressBar) {
      console.log(`⏩ ${this.activeLabel} - Tiến độ: ${this.currentItems}/${this.totalItems}`);
      return;
    }
    
    try {      this.progressBar.update(this.currentItems);
    } catch (_error) {
      // Fallback nếu có lỗi
      console.log(`⏩ ${this.activeLabel} - Tiến độ: ${this.currentItems}/${this.totalItems}`);
      this.isSupported = false;
    }
  }
  
  /**
   * Hoàn thành và đóng progress bar
   */  public complete(): void {
    // Nếu không hỗ trợ thanh tiến trình, hiển thị log thông thường
    if (!this.isSupported || !this.progressBar) {
      console.log(`✅ ${this.activeLabel} - Hoàn thành! (${this.totalItems}/${this.totalItems})`);
      return;
    }
    
    try {
      this.progressBar.update(this.totalItems);
      this.progressBar.stop();
      this.progressBar = null;    } catch (_error) {
      // Fallback nếu có lỗi
      console.log(`✅ ${this.activeLabel} - Hoàn thành! (${this.totalItems}/${this.totalItems})`);
    }
  }
}

export const progressManager = ProgressManager.getInstance();
