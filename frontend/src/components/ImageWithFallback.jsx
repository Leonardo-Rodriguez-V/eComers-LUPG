import React from 'react';

/*
  ImageWithFallback (versión class que enviaste),
  pega en src/components/ImageWithFallback.jsx — sobrescribe/armoniza con la que tengas.
*/
class ImageWithFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src,
      alt: props.alt,
      placeholder: props.placeholder || '/assets/imag/logoNew.png',
      hasError: false,
    };
  }

  handleError = () => {
    this.setState({ src: this.state.placeholder, hasError: true });
  };

  handleLoad = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { src, alt, hasError } = this.state;
    return (
      <img
        src={src}
        alt={alt}
        className={hasError ? 'img-fluid' : ''}
        onError={this.handleError}
        onLoad={this.handleLoad}
      />
    );
  }
}

export default ImageWithFallback;