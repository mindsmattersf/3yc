import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';


class SubLearningObjective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    }
  }
  _toggle (e) {
    var tag = this.props.subLearningObjective
    if (!this.state.active) {
      this.props.addTag(tag)
    }
    else {
      this.props.removeTag(tag)
    }

    this.setState({
      active: this.state.active ? false : true
    })
  }
  render () {
    const buttonMap = {
      Discovery: "btn-outline-primary",
      Readiness: "btn-outline-warning",
      Planning: "btn-outline-success"
    }

    var cssclasses = classNames("btn", buttonMap[this.props.learningObjective],
      "mini-button", this.state.active ? "active" : "")

    return (
          <button
            className={cssclasses}
            type="button"
            onClick={() => this._toggle()}>
              {this.props.subLearningObjective}
          </button>
    )
  }
}

SubLearningObjective.propTypes = {
  learningObjective: PropTypes.string,
  subLearningObjective: PropTypes.string
}

export default SubLearningObjective
