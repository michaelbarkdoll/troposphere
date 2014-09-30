define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/project/ProjectMoveResourceModal.react',
    'components/modals/project/ProjectDeleteResourceModal.react',
    'components/modals/project/ProjectCreateModal.react',
    'components/modals/project/ProjectRemoveResourceModal.react',
    'components/modals/project/ProjectDeleteConditionsModal.react',
    'components/modals/project/ProjectDeleteModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, ProjectMoveResourceModal, ProjectDeleteResourceModal, ProjectCreateModal, ProjectRemoveResourceModal, ProjectDeleteConditionsModal, ProjectDeleteModal) {

    return {

      create: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = ProjectCreateModal({
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      destroy: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");
        if(!payload.project) throw new Error("Must supply project in payload");

        var modal = ProjectDeleteModal({
          project: payload.project,
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      moveResources: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");
        if(!payload.resources) throw new Error("Must supply resources in payload");
        if(!payload.currentProject) throw new Error("Must supply currentProject in payload");

        var modal = ProjectMoveResourceModal({
          currentProject: payload.currentProject,
          resources: payload.resources,

          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      removeResources: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var resources = payload.resources;
        var project = payload.project;

        var modal = ProjectRemoveResourceModal({
          header: "Remove Resources",
          confirmButtonMessage: "Remove resources",
          project: project,
          resources: resources,
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      deleteResources: function(payload, options) {
        if (!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var resources = payload.resources;

        var modal = ProjectDeleteResourceModal({
          header: "Delete Resources",
          confirmButtonMessage: "Delete resources",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel,
          resources: resources
        });

        CommonHelpers.renderComponent(modal);
      },

      explainProjectDeleteConditions: function(){

        var modal = ProjectDeleteConditionsModal({
          header: "Project Delete Conditions",
          confirmButtonMessage: "Okay",
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
