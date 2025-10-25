import { useState, useRef } from 'react'
import { Button, Badge, Switch, Slider, Modal, Toast } from '@toss/tds-mobile'
import { saveAs } from 'file-saver'
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [convertedImage, setConvertedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [adWatched, setAdWatched] = useState(false)
  const fileInputRef = useRef(null)

  // 사진 업로드 처리
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setConvertedImage(null)
        setAdWatched(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // 보상형 광고 시청 처리
  const handleWatchAd = () => {
    setShowAdModal(true)
    // 실제 광고 시청 시뮬레이션
    setTimeout(() => {
      setAdWatched(true)
      setShowAdModal(false)
      Toast.show('광고를 시청했습니다! 이제 AI 변환을 시작할 수 있습니다.')
    }, 3000)
  }

  // AI 이미지 변환 (Google Nano Banana 시뮬레이션)
  const handleConvertImage = async () => {
    if (!selectedImage || !adWatched) return

    setIsProcessing(true)
    
    // 실제 AI 변환 시뮬레이션 (3-5초)
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    // 고양이 사진으로 변환된 결과 시뮬레이션
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      // 간단한 필터 효과로 고양이 느낌 연출
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        // RGB 값을 조정하여 고양이 색상 느낌 연출
        data[i] = Math.min(255, data[i] * 1.2)     // Red
        data[i + 1] = Math.min(255, data[i + 1] * 0.9) // Green  
        data[i + 2] = Math.min(255, data[i + 2] * 1.1) // Blue
      }
      
      ctx.putImageData(imageData, 0, 0)
      const convertedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setConvertedImage(convertedDataUrl)
      setIsProcessing(false)
    }
    
    img.src = selectedImage
  }

  // 변환된 이미지 다운로드
  const handleDownload = () => {
    if (convertedImage) {
      saveAs(convertedImage, 'cat-converted-photo.jpg')
    }
  }

  // 새 사진으로 다시 시작
  const handleReset = () => {
    setSelectedImage(null)
    setConvertedImage(null)
    setAdWatched(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐱 AI Cat Photo Studio</h1>
        <p>사진을 업로드하고 보상형 광고를 시청하면 AI가 고양이 사진으로 변환해드립니다!</p>
        
        <div className="photo-studio">
          {/* 사진 업로드 섹션 */}
          <div className="upload-section">
            <h2>1. 사진 업로드</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-button">
              📸 사진 선택하기
            </label>
            
            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="선택된 사진" />
                <p>선택된 사진</p>
              </div>
            )}
          </div>

          {/* 광고 시청 섹션 */}
          {selectedImage && !adWatched && (
            <div className="ad-section">
              <h2>2. 보상형 광고 시청</h2>
              <p>AI 변환을 위해 광고를 시청해주세요</p>
              <Button onClick={handleWatchAd} size="large">
                📺 광고 시청하기
              </Button>
            </div>
          )}

          {/* AI 변환 섹션 */}
          {selectedImage && adWatched && !convertedImage && (
            <div className="convert-section">
              <h2>3. AI 변환</h2>
              <p>Google Nano Banana AI가 고양이 사진으로 변환합니다</p>
              <Button 
                onClick={handleConvertImage} 
                disabled={isProcessing}
                size="large"
              >
                {isProcessing ? '🔄 변환 중...' : '🤖 AI 변환 시작'}
              </Button>
            </div>
          )}

          {/* 변환 결과 섹션 */}
          {convertedImage && (
            <div className="result-section">
              <h2>🎉 변환 완료!</h2>
              <div className="image-comparison">
                <div className="before-after">
                  <img src={selectedImage} alt="원본" />
                  <p>원본</p>
                </div>
                <div className="arrow">→</div>
                <div className="before-after">
                  <img src={convertedImage} alt="변환된 고양이 사진" />
                  <p>고양이 변환</p>
                </div>
              </div>
              <div className="action-buttons">
                <Button onClick={handleDownload} size="large">
                  💾 다운로드
                </Button>
                <Button onClick={handleReset} variant="outline">
                  🔄 새로 시작
                </Button>
              </div>
            </div>
          )}

          {/* 처리 중 표시 */}
          {isProcessing && (
            <div className="processing">
              <div className="spinner"></div>
              <p>AI가 고양이 사진으로 변환 중입니다...</p>
            </div>
          )}
        </div>
      </header>

      {/* 광고 모달 */}
      <Modal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        title="보상형 광고"
      >
        <div className="ad-content">
          <p>광고를 시청하면 AI 변환을 사용할 수 있습니다!</p>
          <div className="ad-placeholder">
            📺 광고 재생 중...
            <br />
            <small>(3초 후 자동으로 완료됩니다)</small>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App

