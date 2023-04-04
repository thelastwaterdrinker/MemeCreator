import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./Meme.css";

const ImageSelector = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Define dropzone options
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      // Use the first file from the acceptedFiles array
      const file = acceptedFiles[0];
      setSelectedImage(URL.createObjectURL(file));
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{ border: "1px solid #ccc", padding: "10px" }}
      >
        <input {...getInputProps()} />
        <p>Click or drag and drop an image here to upload</p>
      </div>
      {selectedImage && (
        <div>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default function MemeGenerator() {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [randomImg, setRandomImg] = useState("");
  const [allMemeImg, setAllMemeImg] = useState([]);
  const [imgHistory, setImgHistory] = useState([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((response) => {
        const { memes } = response.data;
        console.log(memes);
        setAllMemeImg(memes);
        let randomNum = Math.floor(Math.random() * 100);
        setRandomImg(memes[randomNum]);
        const newImgHistory = [];
        newImgHistory.push(randomNum);
        setImgHistory(newImgHistory);
      });
  }, []);

  function handleTopChange(e) {
    setTopText(e);
  }
  function handleBottomChange(e) {
    setBottomText(e);
  }

  function randomPhoto() {
    let randomNum = Math.floor(Math.random() * 100);
    setRandomImg(allMemeImg[randomNum]);
  }

  function nextPhoto() {
    const newImgHistory = [...imgHistory];
    let randomNum = Math.floor(Math.random() * 100);
    setRandomImg(allMemeImg[randomNum]);
    newImgHistory.push(randomNum);
    setImgHistory(newImgHistory);
    setActiveImgIdx(imgHistory.length);
  }

  function previousPhoto() {
    const prevImgIndex = activeImgIdx - 1;
    setRandomImg(allMemeImg[imgHistory[prevImgIndex]]);
    setActiveImgIdx(prevImgIndex);
  }

  return (
    <div className="meme-form">
      <div className="inputlar">
        <div>
          <h1>Image Selector</h1>
          <ImageSelector />
        </div>

        <div class= 'inputs'>
        <input
          type="text"
          className="input"
          name="topText"
          placeholder="Enter top Text"
          value={topText}
          onChange={(e) => handleTopChange(e.target.value)}
        />
        <input
          type="text"
          className="input"
          name="bottomText"
          placeholder="Enter bottom Text"
          value={bottomText}
          onChange={(e) => handleBottomChange(e.target.value)}
        />
        </div>

        <div class = 'buttons'>
        <button onClick={() => randomPhoto()}>
          <div>
            <span>
              <p>Genereate Meme</p>
            </span>
          </div>
        </button>
       
        <button onClick={() => previousPhoto()}>
            <div>
            <span>
                <p>Previous</p>
              </span>
            </div>
        </button>

        <button onClick={() => nextPhoto()}>
            <div>
              <span>
                <p>Next</p>
              </span>
            </div>
        </button>
        </div>


        <div className="image">
          <img src={randomImg.url} />
          <h2 className="top">{topText}</h2>
          <h2 className="bottom">{bottomText}</h2>
        </div>
      </div>
    </div>
  );
}
