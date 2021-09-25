import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { loadModel, getFullFaceDescription, createMatcher } from '../api/face';

const testImg = require('../img/test.jpg').default;
const JSON_PROFILE = require('../descriptors/face_data_store.json');
const INIT_STATE = {
    imageURL: testImg,
    fullDesc: null,
    detections: null,
    descriptors: null,
    match: null,
    isLoading: true,
};

class ImageInput extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INIT_STATE, faceMatcher: null };
    }

    componentDidMount = async() => {
        await loadModel();
        this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
        await this.handleImage(this.state.imageURL);
    };

    handleImage = async (image = this.state.imageURL) => {
        await getFullFaceDescription(image).then(fullDesc => {
            if (!!fullDesc) {
                this.setState({ 
                    fullDesc,
                    detections: fullDesc.map(fd => fd.detection),
                    descriptors: fullDesc.map(fd => fd.descriptor),
                    isLoading: false
                });
            }
        });

        if (!!this.state.descriptors && !!this.state.faceMatcher) {
            let match = await this.state.descriptors.map(descriptor =>
              this.state.faceMatcher.findBestMatch(descriptor)
            );
            this.setState({ match });
        }
    };

    handleFileChange = async event => {
        this.resetState();
        await this.setState({
            imageURL: URL.createObjectURL(event.target.files[0]),
            isLoading: true
        });
        this.handleImage();
    }

    resetState = () => {
        this.setState({ ...INIT_STATE });
    };

    render() {
        const { imageURL, detections, match, isLoading } = this.state;

        let drawBox = null;
        if (!!detections) {
            drawBox = detections.map((detection, i) => {
                let _H = detection.box.height;
                let _W = detection.box.width;
                let _X = detection.box._x;
                let _Y = detection.box._y;
                return (
                    <div key={i}>
                        <div style={{
                            position: 'absolute',
                            border: 'solid',
                            borderColor: 'blue',
                            height: _H,
                            width: _W,
                            transform: `translate(${_X}px, ${_Y}px)`
                        }}
                        >
                            {!!match && !! match[i] ? (
                                <p style={{
                                    backgroundColor: 'blue',
                                    border: 'solid',
                                    borderColor: 'blue',
                                    width: _W,
                                    marginTop: 0,
                                    color: '#fff',
                                    transform: `translate(-3px,${_H}px)`
                                }}
                                >
                                    {match[i]._label}
                                </p>
                            ) : "adfasdf"}
                        </div>
                    </div>
                );
            });
        }
        if (isLoading === true) {
            drawBox = (
                <div style={{position: 'absolute', zIndex: '9999'}}>
                    <h2>...detecting</h2>
                </div>
            )
           
        }
        return (
            <div>
              <input
                id="myFileUpload"
                type="file"
                onChange={this.handleFileChange}
                accept=".jpg, .jpeg, .png"
              />
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute' }}>
                  <img src={imageURL} alt="imageURL" />
                </div>
                {!!drawBox ? drawBox : null}
              </div>
            </div>
        );
    }
}

export default ImageInput;