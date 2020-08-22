import React, { useState, useEffect } from 'react';
import Dropdown from './AdminDropdown.js';
import { connect } from 'react-redux';
import ImageUploader from '../../react-images-upload';
import { updateProfile, uploadImages } from '../../actions/profile';
import { tagOptions } from '../../data/tagOptions';

const Profile = ({ profile, updateProfile, uploadImages, images }) => {

  var appOptions = [
    { value: 1, label: 'Application required' },
    { value: 0, label: 'No application required' },
  ];

  var recruitOptions = [
    { value: 1, label: 'Accepting members' },
    { value: 0, label: 'Not accepting members' },
  ];

  const [orgName, setOrgName] = useState(profile.name);
  const [orgEmail, setOrgEmail] = useState(profile.owner);
  const [descr, setDescr] = useState(profile.about_us);
  const [descrChars, setChars] = useState(500 - descr.length);
  const [tags, setTags] = useState(profile.tags.map((tag) => tagOptions[tag]));
  const [appReq, setAppReq] = useState(
    appOptions[profile.app_required === true ? 0 : 1]
  );
  const [recruiting, setRecruit] = useState(
    recruitOptions[profile.new_members === true ? 0 : 1]
  );
  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  if (!profile.id) return null;
  const submit = () => {
    const newProfile = {
      name: orgName,
      tags: tags.map((tags) => tags.value),
      about_us: descr,
      app_required: !!appReq.value,
      new_members: !!recruiting.value,
    };
    updateProfile(newProfile);
    let newImages;
    if (logoImage && bannerImage) {
      newImages = { logo: logoImage[0], banner: bannerImage[0] };
    } else if (logoImage) {
      newImages = { logo: logoImage[0] };
    } else if (bannerImage) {
      newImages = { banner: bannerImage[0] };
    } else {
      return;
    }
    uploadImages(newImages);
  };

  const descrChange = (e) => {
    setDescr(e.target.value);
    setChars(500 - e.target.value.length);
  };

  return (
    <div>
      <h3>Profile</h3>
      <div className="admin-text">
        Add an organization logo, profile banner, edit your tags, membership
        status, application requirements, and organization description.
      </div>
      <div className="formGroup">
        <div className="formElement">
          <p>Name of Organization</p>
          <input
            className="userInput"
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>
        <div className="formElement">
          <p>Account Email Address</p>
          <input
            className="userInput"
            type="text"
            disabled="disabled"
            value={orgEmail}
            onChange={(e) => setOrgEmail(e.target.value)}
          />
        </div>
        <p className="subtitle">
          This setting cannot be changed. Please contact{' '}
          <a target="_blank" href="mailto:sproul.club@gmail.com"><span style={{ color: '#54a0f1' }}>sproul.club@gmail.com</span></a> for
          further assistance.
        </p>
        <div className="formElement">
          <p>Tags</p>
          <Dropdown
            options={tagOptions}
            multi={true}
            search={false}
            defaultValue={profile.tags.map((tag) => tagOptions[tag])}
            placeholder="Add up to 3 tags"
            set={setTags}
          />
        </div>
        <div className="formElement">
          <p>Application Requirement</p>
          <Dropdown
            options={appOptions}
            multi={false}
            search={false}
            defaultValue={appOptions[profile.app_required === true ? 0 : 1]}
            placeholder="Select application requirement"
            set={setAppReq}
          />
        </div>
        <div className="formElement">
          <p>Membership Status</p>
          <Dropdown
            options={recruitOptions}
            multi={false}
            search={false}
            defaultValue={recruitOptions[profile.new_members === true ? 0 : 1]}
            placeholder="Select recruitment status"
            set={setRecruit}
          />
        </div>
        <div className="formElement">
          <p>Logo</p>
          <ImageUploader
            label="1:1 ratio - square image"
            buttonStyles={{
              background: '#54a0f1',
            }}
            fileContainerStyle={{
              width: '300px',
              float: 'left',
            }}
            labelStyles={{
              width: '250px',
              marginRight: 0,
              textAlign: 'center',
            }}
            withIcon={true}
            singleImage={true}
            withPreview={true}
            buttonText="Choose image"
            onChange={(e) => setLogoImage(e)}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </div>
        <div className="formElement">
          <p>Banner</p>
          <ImageUploader
            label="820 x 312 pixels - e.g. Facebook cover image"
            buttonStyles={{
              background: '#54a0f1',
            }}
            fileContainerStyle={{
              width: '300px',
              float: 'left',
            }}
            labelStyles={{
              width: '250px',
              marginRight: 0,
              textAlign: 'center',
            }}
            withIcon={true}
            singleImage={true}
            withPreview={true}
            buttonText="Choose image"
            onChange={(e) => setBannerImage(e)}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </div>
        <div className="formElement">
          <p>Description</p>
          <textarea
            className="descriptionInput"
            placeholder="Enter a short description about your organization."
            type="text"
            maxLength={500}
            value={descr}
            onChange={descrChange}
          />
        </div>
        <p className="subtitle">{descrChars} characters remaining</p>
      </div>
      <button className="saveButton" onClick={submit}>
        Save changes
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  images: state.profile.images,
});

export default connect(mapStateToProps, { updateProfile, uploadImages })(
  Profile
);
