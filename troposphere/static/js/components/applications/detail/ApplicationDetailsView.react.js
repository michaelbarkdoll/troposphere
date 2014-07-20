/** @jsx React.DOM */

define(
  [
    'react',
    './header/HeaderView.react',
    './availability/AvailabilityView.react',
    './tags/TagsView.react',
    './launch/ImageLaunchCard.react',
    './description/DescriptionView.react',
    './versions/VersionsView.react',
    'actions/InstanceActions'
  ],
  function (React, HeaderView, AvailabilityView, TagsView, ImageLaunchCard, DescriptionView, VersionsView, InstanceActions) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      showModal: function (e) {
        InstanceActions.launch(this.props.application);
      },

      render: function () {
        var availabilityView, versionView;

        // Since providers requires authentication, we can't display which providers
        // the image is available on on the public page
        if(this.props.providers){
          availabilityView = (
            <AvailabilityView application={this.props.application}
                              providers={this.props.providers}
            />
          );
        }

        // Since identities requires authentication, we can't display the image
        // versions on the public page
        if(this.props.identities){
          versionView = (
            <VersionsView application={this.props.application}
                          identities={this.props.identities}
            />
          );
        }

        return (
          <div id='app-detail' className="container">
            <div className="row">
              <div className="col-md-12">
                <HeaderView application={this.props.application}/>
              </div>
            </div>
            <div className="row image-content">
              <div className="col-md-9">
                <TagsView application={this.props.application}/>
                {availabilityView}
                <DescriptionView application={this.props.application}/>
                {versionView}
              </div>
              <div className="col-md-3">
                <ImageLaunchCard application={this.props.application} onLaunch={this.showModal}/>
              </div>
            </div>

          </div>
        );
      }

    });

  });