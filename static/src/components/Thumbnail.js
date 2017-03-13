import React, {Component, PropTypes} from 'react';


class Thumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }
    mouseOver()  {
        this.setState({hover: true});
    }
    mouseOut()  {
        this.setState({hover: false});
    }
    render() {
        return (
            <div className="grid-box" onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)}>
            {this.state.hover ? (<img src={this.props.url} />) : (<span>"PREVIEW"</span>)}
            </div>
        )
    }
}


Thumbnail.propTypes = {
  url: PropTypes.string
}

export default Thumbnail;
