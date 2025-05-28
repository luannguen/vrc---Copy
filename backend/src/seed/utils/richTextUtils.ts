/**
 * Utilities for handling richText content in Payload CMS
 * Cung cấp chức năng định dạng RichText nâng cao với hỗ trợ Markdown
 */

/**
 * Interface cho RichText structure
 */
interface RichTextNode {
  type: string;
  version: number;
  children?: RichTextNode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  format?: string;
  indent?: number;
  tag?: string;
  direction?: string | null;
}

interface RichTextStructure {
  root: {
    type: string;
    children: RichTextNode[];
    direction: string | null;
    format: string;
    indent: number;
    version: number;
  };
}

/**
 * Tạo cấu trúc richText từ văn bản
 * Hỗ trợ text thuần túy và Markdown
 * 
 * @param content Nội dung văn bản đầu vào
 * @param format Định dạng văn bản ('plain' hoặc 'markdown')
 * @returns Đối tượng RichText structure cho Payload CMS
 */
export function createRichText(content: string, format: 'plain' | 'markdown' = 'plain'): RichTextStructure {
  if (format === 'plain') {
    // Định dạng văn bản thuần túy
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: content,
                version: 1,
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      }
    };
  } else if (format === 'markdown') {
    // Chuyển đổi Markdown thành RichText structure
    const blocks = [];
    
    // Xử lý các đoạn văn bản riêng biệt
    const paragraphs = content.split('\n\n');
    
    for (const paragraph of paragraphs) {
      if (paragraph.startsWith('# ')) {
        // Heading 1
        blocks.push({
          type: 'heading',
          version: 1,
          tag: 'h1',
          children: [
            {
              type: 'text',
              text: paragraph.substring(2),
              version: 1,
            },
          ],
        });
      } else if (paragraph.startsWith('## ')) {
        // Heading 2
        blocks.push({
          type: 'heading',
          version: 1,
          tag: 'h2',
          children: [
            {
              type: 'text',
              text: paragraph.substring(3),
              version: 1,
            },
          ],
        });
      } else if (paragraph.startsWith('### ')) {
        // Heading 3
        blocks.push({
          type: 'heading',
          version: 1,
          tag: 'h3',
          children: [
            {
              type: 'text',
              text: paragraph.substring(4),
              version: 1,
            },
          ],
        });
      } else if (paragraph.startsWith('- ')) {
        // Unordered list
        const items = paragraph.split('\n- ');
        const listItems = items.map(item => {
          const itemText = item.startsWith('- ') ? item.substring(2) : item;
          return {
            type: 'listItem',
            version: 1,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: itemText,
                    version: 1,
                  }
                ]
              }
            ]
          };
        });
        
        blocks.push({
          type: 'ul',
          version: 1,
          children: listItems
        });
      } else if (paragraph.match(/^\d+\. /)) {
        // Ordered list
        const items = paragraph.split(/\n\d+\. /);
        const listItems = items.map(item => {
          const itemText = item.match(/^\d+\. /) ? item.replace(/^\d+\. /, '') : item;
          return {
            type: 'listItem',
            version: 1,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: itemText,
                    version: 1,
                  }
                ]
              }
            ]
          };
        });
        
        blocks.push({
          type: 'ol',
          version: 1,
          children: listItems
        });
      } else if (paragraph.startsWith('```')) {
        // Code block
        const codeContent = paragraph.replace(/^```.*\n/, '').replace(/\n```$/, '');
        blocks.push({
          type: 'code',
          version: 1,
          children: [
            {
              type: 'text',
              text: codeContent,
              version: 1,
            }
          ]
        });
      } else {
        // Regular paragraph with inline formatting
        const inlineFormatted = processInlineFormatting(paragraph);
        blocks.push({
          type: 'paragraph',
          version: 1,
          children: inlineFormatted
        });
      }
    }
    
    return {
      root: {
        type: 'root',
        children: blocks,
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      }
    };
  }
  
  // Default fallback
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              text: content,
              version: 1,
            },
          ],
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    }
  };
}

/**
 * Xử lý định dạng inline trong văn bản
 * 
 * @param text Văn bản đầu vào
 * @returns Mảng các node với định dạng phù hợp
 */
function processInlineFormatting(text: string): RichTextNode[] {
  // Đây chỉ là ví dụ đơn giản, trong thực tế bạn cần regex phức tạp hơn
  // hoặc sử dụng thư viện parser Markdown
  
  const segments: RichTextNode[] = [];
  let currentIndex = 0;
  
  // Tìm các đoạn được đánh dấu in đậm với **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Thêm văn bản trước định dạng in đậm
    if (match.index > currentIndex) {
      segments.push({
        type: 'text',
        text: text.substring(currentIndex, match.index),
        version: 1
      });
    }
    
    // Thêm văn bản in đậm
    segments.push({
      type: 'text',
      text: match[1],
      bold: true,
      version: 1
    });
    
    currentIndex = match.index + match[0].length;
  }
  
  // Thêm phần còn lại của văn bản
  if (currentIndex < text.length) {
    segments.push({
      type: 'text',
      text: text.substring(currentIndex),
      version: 1
    });
  }
  
  return segments.length > 0 ? segments : [{ type: 'text', text, version: 1 }];
}

/**
 * Tạo cấu trúc richText đơn giản với nhiều đoạn văn bản
 * 
 * @param paragraphs Mảng các đoạn văn bản
 * @returns Đối tượng RichText cho Payload CMS
 */
export function createMultiParagraphRichText(paragraphs: string[]): RichTextStructure {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(paragraph => ({
        type: 'paragraph',
        version: 1,
        children: [
          {
            type: 'text',
            text: paragraph,
            version: 1,
          }
        ]
      })),
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    }
  };
}

/**
 * Tạo cấu trúc richText từ HTML
 * Đây chỉ là một phiên bản đơn giản, trong thực tế cần thư viện parser HTML
 * 
 * @param html Chuỗi HTML
 * @returns Đối tượng RichText cho Payload CMS
 */
export function createRichTextFromHTML(html: string): RichTextStructure {
  // Đây chỉ là một ví dụ đơn giản
  // Trong thực tế, bạn nên sử dụng thư viện parser HTML
  // như jsdom hoặc cheerio để chuyển đổi HTML sang RichText
  
  // Loại bỏ các tag HTML đơn giản
  const plainText = html.replace(/<[^>]*>/g, '');
  
  return createRichText(plainText);
}

/**
 * Tạo RichText từ object/JSON
 * 
 * @param obj Đối tượng JSON chứa nội dung
 * @returns Đối tượng RichText cho Payload CMS
 */
export function createRichTextFromJSON(obj: Record<string, any>): RichTextStructure {
  // Xử lý các trường từ đối tượng JSON
  const parts: string[] = [];
  
  // Lặp qua các trường của đối tượng
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      parts.push(`${key}: ${value}`);
    } else if (value !== null && typeof value === 'object') {
      parts.push(`${key}: ${JSON.stringify(value)}`);
    }
  });
  
  return createMultiParagraphRichText(parts);
}
