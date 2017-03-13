import React from 'react';
import classNames from 'classnames';


class ClassYearButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    }
  }

  _handler(e) {
      this.props.updateLessons()
  }

  _toggle (e) {
    if (!this.state.active) {
      this.props.addClassYear(this.props.classYear)
    }
    else {
      this.props.removeClassYear(this.props.classYear)
    }

    this.setState({
      active: this.state.active ? false : true
    })
  }

  render () {
    var cssclasses = classNames("btn", "btn-secondary", "btn-lg", this.state.active ? "active" : "")
    return (
      <button
        className={cssclasses}
        type="button"
        onClick={this._toggle.bind(this)}>
          {this.props.classYear}
      </button>
    )
  }
}
export default ClassYearButton
