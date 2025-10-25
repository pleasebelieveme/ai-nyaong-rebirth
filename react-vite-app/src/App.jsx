import { useState } from 'react'
import { Button, Badge, Switch, Slider } from '@toss/tds-mobile'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isEnabled, setIsEnabled] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Photo Studio</h1>
        <p>AI 기반 사진 편집 스튜디오에 오신 것을 환영합니다!</p>
        
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            카운트: {count}
          </Button>
          <p>
            React + Vite + TDS Mobile로 구축된 현대적인 웹 애플리케이션입니다.
          </p>
        </div>
        
        <div className="tds-components">
          <h2>TDS Mobile 컴포넌트 예제</h2>
          <div className="component-demo">
            <div className="demo-item">
              <Badge>새로운 기능</Badge>
              <span>Badge 컴포넌트</span>
            </div>
            <div className="demo-item">
              <Switch 
                checked={isEnabled} 
                onChange={setIsEnabled}
              />
              <span>Switch: {isEnabled ? 'ON' : 'OFF'}</span>
            </div>
            <div className="demo-item">
              <Slider 
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
              />
              <span>Slider 값: {sliderValue}</span>
            </div>
          </div>
        </div>
        
        <div className="features">
          <h2>주요 기능</h2>
          <ul>
            <li>🚀 빠른 개발 환경 (Vite)</li>
            <li>⚛️ React 18 최신 기능</li>
            <li>🎨 TDS Mobile UI 컴포넌트</li>
            <li>📱 반응형 디자인</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App

