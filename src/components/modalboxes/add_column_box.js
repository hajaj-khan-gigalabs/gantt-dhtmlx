import React from "react";
import "./modal.css";

class AddColumnBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBox: false,
      label: "",
      fieldName: "",
      columnWidth: 100,
    };
  }
  onSubmit() {
    this.props.onColumnAdd(this.state);
    this.setState({ showBox: !this.state.showBox });
  }
  render() {
    return (
      <>
        <button onClick={() => this.setState({ showBox: !this.state.showBox })}>
          Add column in Chart Grid
        </button>
        {this.state.showBox === true ? (
          <>
            <div id="myModal" className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add Column</h2>
                  <span
                    className="close"
                    onClick={() =>
                      this.setState({ showBox: !this.state.showBox })
                    }
                  >
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="fields">
                    <div>
                    <label>Add label of column:</label>
                    <br />
                    <input
                      type="text"
                      id="label"
                      name="label"
                      value={this.state.label}
                      onChange={(e) => this.setState({ label: e.target.value })}
                    />
                    </div>
                    <div>
                    <label>Column Width:</label>
                    <br />
                    <input
                      type="number"
                      id="width"
                      name="width"
                      value={this.state.columnWidth}
                      onChange={(e) => this.setState({ columnWidth: e.target.value })}
                    />
                    </div>
                    </div>
                    <div className="submit">
                    <input
                      type="submit"
                      value="Submit"
                      onClick={() => this.onSubmit()}
                    />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    );
  }
}

export default AddColumnBox;
