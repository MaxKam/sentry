import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

import {addErrorMessage} from '../../../../actionCreators/indicator';
import ApiMixin from '../../../../mixins/apiMixin';
import AvatarChooser from '../../../../components/avatarChooser';
import Form from '../../components/forms/form';
import JsonForm from '../../components/forms/jsonForm';
import OrganizationState from '../../../../mixins/organizationState';
import organizationSettingsFields from '../../../../data/forms/organizationGeneralSettings';

const NewOrganizationSettingsForm = createReactClass({
  displayName: 'NewOrganizationSettingsForm',

  propTypes: {
    location: PropTypes.object,
    orgId: PropTypes.string.isRequired,
    access: PropTypes.object.isRequired,
    initialData: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
  },

  mixins: [ApiMixin, OrganizationState],

  render() {
    let {initialData, orgId, onSave, access} = this.props;
    let endpoint = `/organizations/${orgId}/`;
    return (
      <Form
        className="ref-organization-settings"
        apiMethod="PUT"
        apiEndpoint={endpoint}
        saveOnBlur
        allowUndo
        initialData={initialData}
        onSubmitSuccess={(resp, model, fieldName, change) => {
          // Special case for slug, need to forward to new slug
          if (typeof onSave === 'function') {
            onSave(initialData, model.initialData);
          }
        }}
        onSubmitError={error => {
          if (error.responseJSON && 'require2FA' in error.responseJSON) {
            return addErrorMessage(
              'Unable to save change. Enable two-factor authentication on your account first.'
            );
          }
          return addErrorMessage('Unable to save change');
        }}
      >
        <Box>
          <JsonForm
            features={this.getFeatures()}
            access={access}
            location={this.props.location}
            forms={organizationSettingsFields}
          />
          <AvatarChooser allowGravatar={false} endpoint={endpoint} model={initialData} />
        </Box>
      </Form>
    );
  },
});

export default NewOrganizationSettingsForm;
