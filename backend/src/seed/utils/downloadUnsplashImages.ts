import https from 'https'
import fs from 'fs'
import path from 'path'

/**
 * Download ảnh từ Unsplash với chất lượng tối ưu
 */
export async function downloadUnsplashImage(
  url: string,
  filename: string,
  downloadDir: string
): Promise<string | null> {
  try {
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true })
    }

    const filePath = path.join(downloadDir, filename)

    // Kiểm tra nếu file đã tồn tại
    if (fs.existsSync(filePath)) {
      console.log(`✅ Image already exists: ${filename}`)
      return filePath
    }

    // Tối ưu URL cho chất lượng và kích thước phù hợp
    const optimizedUrl = `${url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`

    console.log(`📥 Downloading: ${filename} from ${optimizedUrl}`)

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath)

      https.get(optimizedUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`))
          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close()
          console.log(`✅ Downloaded: ${filename}`)
          resolve(filePath)
        })

        file.on('error', (err) => {
          fs.unlink(filePath, () => {}) // Xóa file lỗi
          reject(err)
        })
      }).on('error', (err) => {
        reject(err)
      })
    })
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error)
    return null
  }
}

/**
 * Download tất cả ảnh Unsplash cho projects
 */
export async function downloadAllProjectImages(): Promise<Record<string, string[]>> {
  const downloadDir = path.join(process.cwd(), '../vrcfrontend/public/assets/images/projects')

  const imageUrls = {
    // Industrial Projects
    'industrial-hero.jpg': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    'industrial-gallery-1.jpg': 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c',
    'industrial-gallery-2.jpg': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
    'industrial-gallery-3.jpg': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    'industrial-gallery-4.jpg': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',

    // Commercial Projects
    'commercial-hero.jpg': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    'commercial-gallery-1.jpg': 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e',
    'commercial-gallery-2.jpg': 'https://images.unsplash.com/photo-1515263487990-61b07816b324',
    'commercial-gallery-3.jpg': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',

    // Specialized Projects
    'specialized-hero.jpg': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    'specialized-gallery-1.jpg': 'https://images.unsplash.com/photo-1611091248112-ebe885c3c192',
    'specialized-gallery-2.jpg': 'https://images.unsplash.com/photo-1516549655169-df83a0774514',
    'specialized-gallery-3.jpg': 'https://images.unsplash.com/photo-1627745193246-1fa1c9404b21',

    // Từ các trang specialized khác
    'specialized-gallery-4.jpg': 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1',
    'specialized-gallery-5.jpg': 'https://images.unsplash.com/photo-1581095459868-1e25c53b9670',
    'specialized-gallery-6.jpg': 'https://images.unsplash.com/photo-1566669437687-7040a6926753',
    'specialized-gallery-7.jpg': 'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02',
    'specialized-gallery-8.jpg': 'https://images.unsplash.com/photo-1597138804456-e7607e72e3c7',

    // Projects page hero background
    'projects-hero-bg.jpg': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef'
  }

  console.log('🖼️ Starting download of project images from Unsplash...')

  const downloadedPaths: Record<string, string[]> = {
    industrial: [],
    commercial: [],
    specialized: [],
    backgrounds: []
  }

  try {
    for (const [filename, url] of Object.entries(imageUrls)) {
      const downloadedPath = await downloadUnsplashImage(url, filename, downloadDir)

      if (downloadedPath) {
        // Phân loại theo project type
        if (filename.includes('industrial')) {
          downloadedPaths.industrial?.push(downloadedPath)
        } else if (filename.includes('commercial')) {
          downloadedPaths.commercial?.push(downloadedPath)
        } else if (filename.includes('specialized')) {
          downloadedPaths.specialized?.push(downloadedPath)
        } else if (filename.includes('hero-bg')) {
          downloadedPaths.backgrounds?.push(downloadedPath)
        }
      }
    }    console.log('🎉 All project images downloaded successfully!')
    console.log('📊 Download summary:', {
      industrial: downloadedPaths.industrial?.length || 0,
      commercial: downloadedPaths.commercial?.length || 0,
      specialized: downloadedPaths.specialized?.length || 0,
      backgrounds: downloadedPaths.backgrounds?.length || 0
    })

    return downloadedPaths
  } catch (error) {
    console.error('❌ Error downloading project images:', error)
    throw error
  }
}
