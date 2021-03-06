import React, { useState } from 'react';
import Dropdown from './AdminDropdown.js';
import { connect } from 'react-redux';
import ImageUploader from '../../react-images-upload';
import { updateProfile, uploadLogo, uploadBanner } from '../../actions/profile';
import { NotificationManager } from 'react-notifications';
import RichText from '../RichText'
import {stateFromHTML} from 'draft-js-import-html';
import {stateToHTML} from 'draft-js-export-html';


const Profile = ({
  profile,
  updateProfile,
  uploadLogo,
  uploadBanner,
  images,
  tagOptions,
}) => {
  var appOptions = [
    { value: 1, label: 'Application required' },
    { value: 0, label: 'No application required' },
  ];

  var recruitOptions = [
    { value: 1, label: 'Accepting members' },
    { value: 0, label: 'Not accepting members' },
  ];
  console.log(stateFromHTML(profile.about_us))
  const [orgName, setOrgName] = useState(profile.name);
  const [orgEmail, setOrgEmail] = useState(profile.owner);
  const [descr, setDescr] = useState(stateFromHTML(profile.about_us));
  const [descrChars, setChars] = useState(750 - profile.about_us.replace(/<[^>]*>?/gm, '').length);
  const [tags, setTags] = useState(profile.tags.map((tag) => tagOptions[tag]));
  const [appReq, setAppReq] = useState(
    appOptions[profile.app_required === true ? 0 : 1]
  );
  const [recruiting, setRecruit] = useState(
    recruitOptions[profile.new_members === true ? 0 : 1]
  );
  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);


  async function uploadLogoPic(logoUploads) {
    if (logoUploads && logoUploads.length > 0) {
      try {
        NotificationManager.info('Uploading logo...', '', 1500);
        await uploadLogo(logoUploads[0]);
        NotificationManager.success('Logo uploaded successfully!', '', 1500);
      } catch (err) {
        if (err.response.status === 503) {
          NotificationManager.error(
            'Something went wrong on our end. Please try again later',
            'Logo image upload unsuccessful',
            5000
          );
        } else {
          NotificationManager.error(
            'For best results, please upload a logo that has an aspect ratio of 1:1',
            'Logo image upload unsuccessful',
            5000
          );
        }
      }
    }
  }

  async function uploadBannerPic(bannerUploads) {
    if (bannerUploads && bannerUploads.length > 0) {
      try {
        NotificationManager.info('Uploading banner...', '', 1500);
        await uploadBanner(bannerUploads[0]);
        NotificationManager.success('Banner uploaded successfully!', '', 1500);
      } catch (err) {
        if (err.response.status === 503) {
          NotificationManager.error(
            'Something went wrong on our end. Please try again later',
            'Banner image upload unsuccessful',
            5000
          );
        } else {
          NotificationManager.error(
            'For best results, please upload a logo that has an aspect ratio of 8:3',
            'Banner image upload unsuccessful',
            5000
          );
        }
      }
    }
  }

  const submit = async () => {
    console.log(descr)
    const newProfile = {
      name: orgName.trim(),
      owner: orgEmail,
      tags: tags.map((tags) => tags.value),
      about_us: stateToHTML(descr),
      app_required: !!appReq.value,
      new_members: !!recruiting.value,
    };

    try {
      await updateProfile(newProfile);
      NotificationManager.success('Profile changes saved successfully!', '', 1500);
    } catch (err) {
      NotificationManager.error('Profile changes unsuccessful!', '', 1500);
    }

    await Promise.all([
      uploadLogoPic(logoImage),
      uploadBannerPic(bannerImage)
    ]);
  };

  const reqFieldsCheck = () => {
    if (tags === null) {
      NotificationManager.error(
        'Please have at least one tag',
        'Changes not saved',
        1500
      );
    } else {
      NotificationManager.error(
        'Please enter an organization name',
        'Changes not saved',
        1500
      );
    }
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
            maxLength={100}
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
          <span style={{ color: '#FF0000' }}>*</span> This setting cannot be
          changed. Please contact{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:sproul.club@gmail.com"
          >
            <span style={{ color: '#54a0f1' }}>sproul.club@gmail.com</span>
          </a>{' '}
          for further assistance.
        </p>
        <div className="formElement">
          <p>Tags</p>
          <Dropdown
            options={tagOptions}
            multi={true}
            search={true}
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
            maxFileSize={16777216}
          />
        </div>
        <p className="subtitle">
          <span style={{ color: '#FF0000' }}>*</span> Please make sure your logo
          is at least 360 x 360 pixels.{' '}
          <a
            href="https://www.photoresizer.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span style={{ color: '#54a0f1' }}>Click here</span>
          </a>{' '}
          for a resource that helps you resize your images.
        </p>
        <div className="formElement">
          <p>Banner</p>
          <ImageUploader
            label="8:3 ratio - e.g. Facebook cover image"
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
            maxFileSize={16777216}
          />
        </div>
        <p className="subtitle">
          <span style={{ color: '#FF0000' }}>*</span> Please make sure your
          banner is at least 1640 x 624 pixels.{' '}
          <a
            href="https://www.photoresizer.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span style={{ color: '#54a0f1' }}>Click here</span>
          </a>{' '}
          for a resource that helps you resize your images.
        </p>
        <div className="formElement">
          <p>Description</p>
          {/* <textarea
            className="descriptionInput"
            placeholder="Enter a short description about your organization."
            type="text"
            maxLength={750}
            value={descr}
            onChange={descrChange}
          /> */}
          <RichText setChars={setChars} setDescr={setDescr} descr={descr}/>
        </div>
        <p className="subtitle">{descrChars} characters remaining</p>
      </div>
      <button
        className="saveButton"
        onClick={
          tags === null || orgName.match(/^ *$/) !== null
            ? reqFieldsCheck
            : submit
        }
      >
        Save changes
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  images: state.profile.images,
  tagOptions: state.profile.tagOptions,
});

export default connect(mapStateToProps, {
  updateProfile,
  uploadLogo,
  uploadBanner,
})(Profile);
