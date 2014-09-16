/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, BootstrapModalMixin) {

    // Example Usage from http://bl.ocks.org/insin/raw/8449696/
    // render: function(){
    // <div>
    //   ...custom components...
    //   <ExampleModal
    //      ref="modal"
    //      show={false}
    //      header="Example Modal"
    //      buttons={buttons}
    //      handleShow={this.handleLog.bind(this, 'Modal about to show', 'info')}
    //      handleShown={this.handleLog.bind(this, 'Modal showing', 'success')}
    //      handleHide={this.handleLog.bind(this, 'Modal about to hide', 'warning')}
    //      handleHidden={this.handleLog.bind(this, 'Modal hidden', 'danger')}
    //    >
    //      <p>I'm the content.</p>
    //      <p>That's about it, really.</p>
    //    </ExampleModal>
    // </div>
    //

    // To show the modal, call this.refs.modal.show() from the parent component:
    // handleShowModal: function() {
    //   this.refs.modal.show();
    // }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      getInitialState: function () {
        return {
          projectName: "",
          projectDescription: ""
        };
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      // todo: I don't think there's a reason to update state unless
      // there's a risk of the component being re-rendered by the parent.
      // Should probably verify this behavior, but for now, we play it safe.
      onProjectNameChange: function (e) {
        this.setState({projectName: e.target.value});
      },

      onProjectDescriptionChange: function (e) {
        this.setState({projectDescription: e.target.value});
      },

      //
      // Render Helpers
      // --------------
      //

      renderMovedVolume: function(movedVolumeData){
        var volume = movedVolumeData.volume;
        var instance = movedVolumeData.instance;
        var oldProject = movedVolumeData.oldProject;
        var newProject = movedVolumeData.newProject;
        var message;
        if(oldProject){
          message = (
            <div>
              <span>{"Moved the volume "}</span>
              <strong>{volume.get('name')}</strong>
              <span>{" from the project "}</span>
              <strong>{oldProject.get('name')}</strong>
              <span>{" and into the project "}</span>
              <strong>{newProject.get('name')}</strong>
            </div>
          );
        }else{
          message = (
            <div>
              <span>{"Moved the volume "}</span>
              <strong>{volume.get('name')}</strong>
              <span>{" into the project "}</span>
              <strong>{newProject.get('name')}</strong>
            </div>
          );
        }

        return (
          <li>{message}</li>
        )
      },

      //
      // Render
      // ------
      //

      render: function () {
        var buttonArray = [
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var stateIsValid = true;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var content = (
          <form role='form'>
            <div className='form-group'>
              <ul>
                {this.props.movedVolumesArray.map(this.renderMovedVolume)}
              </ul>
            </div>
          </form>
        );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <strong>{this.props.header}</strong>
                </div>
                <div className="modal-body">
                  {content}
                </div>
                <div className="modal-footer">
                  {buttons}
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });