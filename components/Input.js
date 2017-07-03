import PropTypes from 'prop-types'
import React from 'react'

export default class Input extends React.Component {
  constructor(props) {
    super(props)
    this.onBaseRef = this.onBaseRef.bind(this)
    this.onInputRef = this.onInputRef.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.state = {
      baseWidth: null,
      value: this.props.value != null ? this.props.value : null,
      invalidCharacters: false
    }
    this.focusTask = null
    this.measurementTask = null
    this.initialValue = this.props.value
    this.baseEl = null
    this.inputEl = null
  }

  componentDidMount() {
    if (this.props.prefix != null) {
      if (this.state.baseWidth === null) {
        this.measurementTask = requestAnimationFrame(() => {
          const w = this.baseEl.getBoundingClientRect().width
          this.setState({ baseWidth: w })
          this.measurementTask = null
        })
      }
    }
  }

  onBaseRef(el) {
    this.baseEl = el
  }

  onInputRef(el) {
    this.inputEl = el

    if (el) {
      if (this.initialValue != null) {
        el.value = this.initialValue
        this.initialValue = null
      }

      if (this.props.autofocus) {
        el.focus()
      }

      if (this.props.select) {
        el.select()
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // we focus if we have an input, if autofocus was set
    // and wasnt set, or if it was set and we just got
    // out of the waiting state
    if (
      this.inputEl &&
      nextProps.autofocus &&
      (!this.props.autofocus || (this.props.waiting && !nextProps.waiting))
    ) {
      this.focusTask = requestAnimationFrame(() => {
        this.inputEl.focus()
      })
    }
  }

  onClick(e) {
    if (!this.inputEl) return
    if (e.target !== this.inputEl) {
      this.inputEl.focus()
    }
  }

  onInput(e) {
    const { value: value_ } = e.target
    const value = this.props.trim !== false ? value_.trim() : value_
    if (
      value === '' || // we don't show errors if empty
      (this.props.validate ? this.props.validate.test(value) : true)
    ) {
      this.setState({
        value: value,
        invalidCharacters: false
      })
      this.props.onValue && this.props.onValue(null, value)
    } else {
      this.setState({
        value: value,
        invalidCharacters: true
      })
      this.props.onValue &&
        this.props.onValue(new Error('Validation error'), value)
    }
  }

  onFocus() {
    this.setState({ focused: true })
  }

  onBlur() {
    this.setState({ focused: false })
  }

  getValue() {
    const { value: value_ } = this.inputEl
    return this.props.trim !== false ? value_.trim() : value_
  }

  render() {
    const {
      error = false,
      centered = false,
      waiting = false,
      placeholder = '',
      width = '300px',
      fontSize
    } = this.props
    const { invalidCharacters, focused } = this.state
    const hasError = error || invalidCharacters
    const count = this.state.value !== null ? this.state.value.length : 0
    const textIndent =
      this.state.baseWidth != null ? this.state.baseWidth : null
    const dark = this.context.darkBg
    return (
      <div
        onClick={this.onClick}
        className={`
          ${centered ? 'centered' : ''}
          ${waiting ? 'waiting' : ''}
          ${focused ? 'focused' : ''}
          ${hasError ? 'error' : ''}
          ${dark ? 'dark' : 'light'}
        `}
        style={{ width }}
      >
        {this.props.prefix != null &&
          <span
            style={{ visibility: this.state.baseWidth == null ? 'hidden' : '' }}
            className="clone"
          >
            <span ref={this.onBaseRef} className="base">
              {this.props.prefix}
            </span>
            <span className="value">
              {this.state.value}
            </span>
          </span>}
        <input
          ref={this.onInputRef}
          defaultValue={this.props.prefix == null ? this.initialValue : null}
          maxLength={this.props.maxLength}
          placeholder={placeholder}
          disabled={waiting}
          style={{ textIndent, width, fontSize }}
          onBlur={this.onBlur}
          onInput={this.onInput}
          onFocus={this.onFocus}
          className={this.props.prefix ? 'has-prefix' : ''}
        />
        {false !== this.props.lengthIndicator &&
          (this.props.maxLength != null || this.props.lengthIndicator) &&
          <span className="counter">
            <span className={`count count_${count}`}>
              {count}
            </span>
            {this.props.maxLength != null &&
              <span className="total">
                /{this.props.maxLength}
              </span>}
          </span>}
        {waiting && <span className="waiting_anim" />}
        <style jsx>
          {`
            div {
              display: inline-block;
              position: relative;
              width: 300px;
              height: 30px;
              cursor: text;
              font-family: 'San Francisco';
              transition: border-bottom-color 100ms ease-in;
            }

            div.light {
              border-bottom: 1px solid #eee;
            }

            div.dark {
              border-bottom: 1px solid #666;
            }

            div.dark:not(.error) input {
              color: #fff;
            }

            input::placeholder {
              color: #9b9b9b;
            }

            div.focused.light {
              border-bottom-color: #000;
            }

            div.focused.dark {
              border-bottom-color: #fff;
            }

            div.error,
            div.error.focused.light {
              border-bottom-color: #ff001f;
            }

            div.waiting,
            div.waiting.focused.light {
              border-bottom-color: #eee;
            }

            input,
            .clone {
              /* use 'font' to redefine line-height */
              font: 16px 'San Francisco';
              height: 18px;
            }

            input.has-prefix::-webkit-contacts-auto-fill-button {
              visibility: hidden;
              display: none !important;
              pointer-events: none;
              position: absolute;
              right: 0;
            }

            .clone {
              overflow: hidden;
              white-space: nowrap;
            }

            .clone .base {
              color: #9b9b9b;
              cursor: default;
              user-select: none;
            }

            .error .clone .base {
              color: #ff687b;
            }

            .waiting .clone .base {
              color: #ccc;
            }

            .value {
              white-space: pre; /* to show whitespace like input */
              color: transparent;
            }

            input,
            .clone {
              position: absolute;
              top: 0;
              left: 0;
              width: 300px;
              text-align: left;
            }

            .centered input,
            .centered .clone {
              text-align: center;
            }

            input {
              border-width: 0;
              background: transparent;
            }

            input:focus {
              outline: none;
            }

            .error input {
              color: #ff001f;
            }

            .waiting input {
              color: #ccc;
              pointer-events: none;
            }

            .counter {
              opacity: 0;
              transition: opacity 100ms ease-out;
              position: absolute;
              bottom: -22px;
              right: 0;
              font-weight: 100;
              color: #9b9b9b;
              font-size: 12px;
            }

            .focused .counter {
              opacity: 1;
            }

            .counter .count {
              color: #000;
            }

            .counter .count.count_0 {
              color: #9b9b9b;
            }

            .waiting .counter {
              display: none;
            }

            .waiting_anim {
              display: block;
              position: absolute;
              bottom: -1px;
              background: #9b9b9b;
              width: 100px;
              height: 1px;
              animation-name: waiting;
              animation-duration: 1s;
              animation-direction: alternate;
              animation-iteration-count: infinite;
              animation-timing-function: cubic-bezier(0.0, 0.0, 1.0, 1.0);
            }

            @keyframes waiting {
              0% {
                transform: translateX(0);
                width: 50px;
                opacity: 0;
              }
              50% {
                width: 100px;
                opacity: 1;
                transform: translateX(100px);
              }
              100% {
                width: 50px;
                opacity: 0;
                transform: translateX(250px);
              }
            }
          `}
        </style>
      </div>
    )
  }

  componenWillUnmount() {
    if (this.measurementTask !== null) {
      cancelAnimationFrame(this.measurementTask)
      this.measurementTask = null
    }
    if (this.focusTask !== null) {
      cancelAnimationFrame(this.focusTask)
      this.focusTask = null
    }
  }
}

Input.contextTypes = {
  darkBg: PropTypes.bool
}
