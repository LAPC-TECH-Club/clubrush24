import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import CODE from './codelines.jpg'
import Discord from './interest.png'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: rgba(0, 0, 0);
  }
`;

const Customs = styled.div`
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-image: url(${CODE});
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
  opacity: 0.4;
`

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const SlideshowContainer = styled.div`
  width: calc(75vw - 80px);
  height: calc(100vh - 80px);
  margin: 40px;
  position: relative;
  overflow: hidden;
`;

const SlideImage = styled.img`
  position: absolute;
  top: 0;
  left: ${props => props.position}%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: left 0.5s ease-in-out;
`;

const ControlPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0.5;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const RightPanel = styled.div`
  width: 25vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GreenBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 80%;
  height: 80%;
  padding-right: 50px;
  justify-content: center;
`;

const Title = styled.div`
  text-align: center;
  color: white;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 60px;
`

const HiddenInput = styled.input`
  display: none;
`;

const JoinLink = styled.img`
  width: 80%;
`

const App = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState(0);
  const fileInputRef = useRef(null);
  const autoPlayIntervalRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const showPreviousImage = () => {
    if (images.length > 0) {
      setNextIndex((currentIndex - 1 + images.length) % images.length);
      setSlideDirection(100);
    }
  };

  const showNextImage = () => {
    setNextIndex((currentIndex + 1) % images.length);
    setSlideDirection(-100);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayIntervalRef.current = setInterval(showNextImage, 5000);
    } else {
      clearInterval(autoPlayIntervalRef.current);
    }
    return () => clearInterval(autoPlayIntervalRef.current);
  }, [isAutoPlaying, showNextImage]);

  useEffect(() => {
    if (nextIndex !== null) {
      const timer = setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex(null);
        setSlideDirection(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [nextIndex]);

  return (
    <>
      <Customs></Customs>
      <GlobalStyle />
      <AppContainer>
        <SlideshowContainer>
          {images.length > 0 && (
            <>
              <SlideImage 
                src={images[currentIndex]} 
                alt="Current image"
                position={slideDirection}
              />
              {nextIndex !== null && (
                <SlideImage 
                  src={images[nextIndex]} 
                  alt="Next image"
                  position={slideDirection < 0 ? 100 : -100}
                />
              )}
            </>
          )}
          <ControlPanel>
            <Button onClick={showPreviousImage}>Previous</Button>
            <Button onClick={showNextImage}>Next</Button>
            <Button onClick={toggleAutoPlay}>
              {isAutoPlaying ? 'Stop Auto Play' : 'Start Auto Play'}
            </Button>
            <Button onClick={() => fileInputRef.current.click()}>
              Upload Images
            </Button>
          </ControlPanel>
        </SlideshowContainer>
        <RightPanel>
          <GreenBox>
            <Title>
              <div style={{fontWeight: '600', marginBottom: '30px'}}>Want to make cool projects like this?</div>Join the <span style={{color: '#e82727'}}>TECH</span> Club!
            </Title>
            <div style={{color: "#e82727", fontSize: '20px', marginBottom: '10px'}}>Interest form below:</div>
            <JoinLink src={Discord}/>
          </GreenBox>
        </RightPanel>
        <HiddenInput 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          multiple
          onChange={handleFileChange}
        />
      </AppContainer>
    </>
  );
};

export default App;