/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-prototype-builtins */
/* eslint-disable consistent-return */
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  userSigninStart,
  userSigninSuccess,
  userSigninFailure,
  userSignupStart,
  userSignupSuccess,
  userSignupFailure,
  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,
  findUserStart,
  findUserSuccess,
  findUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  findAllUsersStart,
  findAllUsersSuccess,
  findAllUsersFailure,
  findAllFreeBarberStart,
  findAllFreeBarberSuccess,
  findAllFreeBarberFailure,
  findAllReceptionistStart,
  findAllReceptionistSuccess,
  findAllReceptionistFailure,
} from './userSlice';
import {
  uploadAudioFailure,
  uploadAudioStart,
  uploadAudioSuccess,
  uploadImageFailure,
  uploadImageStart,
  uploadImageSuccess,
} from './uploadSlice';
import {
  createCommentFailure,
  createCommentStart,
  createCommentSuccess,
  deleteCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  getChildrenFailure,
  getChildrenStart,
  getChildrenSuccess,
  getParentFailure,
  getParentStart,
  getParentSuccess,
} from './commentSlice';
import {
  createNotificationFailure,
  createNotificationStart,
  createNotificationSuccess,
  getAllNotificationsFailure,
  getAllNotificationsStart,
  getAllNotificationsSuccess,
  updateNotificationFailure,
  updateNotificationStart,
  updateNotificationSuccess,
} from './notificationSlice';
import {
  createSliderFailure,
  createSliderStart,
  createSliderSuccess,
  deleteSliderFailure,
  deleteSliderStart,
  deleteSliderSuccess,
  getActiveSlidersFailure,
  getActiveSlidersStart,
  getActiveSlidersSuccess,
  getAllSlidersFailure,
  getAllSlidersStart,
  getAllSlidersSuccess,
  getByCollectionFailure,
  getByCollectionStart,
  getByCollectionSuccess,
  getCollectionsFailure,
  getCollectionsStart,
  getCollectionsSuccess,
  getSliderFailure,
  getSliderStart,
  getSliderSuccess,
  toggleSliderFailure,
  toggleSliderStart,
  toggleSliderSuccess,
  updateSliderFailure,
  updateSliderStart,
  updateSliderSuccess,
} from './sliderSlice';
import {
  createServiceFailure,
  createServiceStart,
  createServiceSuccess,
  deleteServiceFailure,
  deleteServiceStart,
  deleteServiceSuccess,
  getAllServicesFailure,
  getAllServicesStart,
  getAllServicesSuccess,
  getServiceFailure,
  getServiceStart,
  getServiceSuccess,
  updateServiceFailure,
  updateServiceStart,
  updateServiceSuccess,
} from './serviceSlice';
import {
  createAppointmentFailure,
  createAppointmentStart,
  createAppointmentSuccess,
  deleteAppointmentFailure,
  deleteAppointmentStart,
  deleteAppointmentSuccess,
  findAllAppointmentsFailure,
  findAllAppointmentsStart,
  findAllAppointmentsSuccess,
  updateAppointmentFailure,
  updateAppointmentStart,
  updateAppointmentSuccess,
} from './appointmentSlice';
import {
  createInventoryFailure,
  createInventoryStart,
  createInventorySuccess,
  deleteInventoryFailure,
  deleteInventoryStart,
  deleteInventorySuccess,
  getAllInventorysFailure,
  getAllInventorysStart,
  getAllInventorysSuccess,
  getInventoryFailure,
  getInventoryStart,
  getInventorySuccess,
  updateInventoryFailure,
  updateInventoryStart,
  updateInventorySuccess,
} from './inventorySlice';
import {
  createInvoiceFailure,
  createInvoiceStart,
  createInvoiceSuccess,
  getAllInvoicesFailure,
  getAllInvoicesStart,
  getAllInvoicesSuccess,
  getInvoiceFailure,
  getInvoiceStart,
  getInvoiceSuccess,
  updateInvoiceFailure,
  updateInvoiceStart,
  updateInvoiceSuccess,
} from './invoiceSlice';
import {
  createReviewFailure,
  createReviewStart,
  createReviewSuccess,
  getAllReviewsFailure,
  getAllReviewsStart,
  getAllReviewsSuccess,
  getReviewFailure,
  getReviewStart,
  getReviewSuccess,
} from './reviewSlice';
import {
  getBarberIncomeFailure,
  getBarberIncomeStart,
  getBarberIncomeSuccess,
  getBarberRatingFailure,
  getBarberRatingStart,
  getBarberRatingSuccess,
  getBarbersIncomeFailure,
  getBarbersIncomeStart,
  getBarbersIncomeSuccess,
  getBarbersRatingFailure,
  getBarbersRatingStart,
  getBarbersRatingSuccess,
  getSystemAppointmentFailure,
  getSystemAppointmentStart,
  getSystemAppointmentSuccess,
  getSystemIncomeFailure,
  getSystemIncomeInDurationFailure,
  getSystemIncomeInDurationStart,
  getSystemIncomeInDurationSuccess,
  getSystemIncomeInMonthFailure,
  getSystemIncomeInMonthStart,
  getSystemIncomeInMonthSuccess,
  getSystemIncomeStart,
  getSystemIncomeSuccess,
} from './statisticSlice';
import {
  createGiftFailure,
  createGiftStart,
  createGiftSuccess,
  deleteGiftFailure,
  deleteGiftStart,
  deleteGiftSuccess,
  getAllGiftsFailure,
  getAllGiftsStart,
  getAllGiftsSuccess,
  getRedemptionsFailure,
  getRedemptionsStart,
  getRedemptionsSuccess,
  redeemGiftFailure,
  redeemGiftStart,
  redeemGiftSuccess,
  updateGiftFailure,
  updateGiftStart,
  updateGiftSuccess,
} from './giftSlice';
import {
  applyDiscountFailure,
  applyDiscountStart,
  applyDiscountSuccess,
  createDiscountFailure,
  createDiscountStart,
  createDiscountSuccess,
  deleteDiscountFailure,
  deleteDiscountStart,
  deleteDiscountSuccess,
  getAllDiscountsFailure,
  getAllDiscountsStart,
  getAllDiscountsSuccess,
  getUserDiscountsFailure,
  getUserDiscountsStart,
  getUserDiscountsSuccess,
  updateDiscountFailure,
  updateDiscountStart,
  updateDiscountSuccess,
} from './discountSlice';
import { getAllSalaryFailure, getAllSalaryStart, getAllSalarySuccess } from './salarySlice';

const REACT_APP_BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

// Start user
export const signin = async (user, dispatch, navigate) => {
  dispatch(userSigninStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/signin`, user);
    const refreshToken = res.data.metadata.tokens.refreshToken;
    const accessToken = res.data.metadata.tokens.accessToken;
    const userInformation = res.data.metadata.user;
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken, {
      expires: 7,
    });
    for (let key in userInformation) {
      if (userInformation.hasOwnProperty(key)) {
        Cookies.set(key, userInformation[key], {
          expires: 7,
        });
      }
    }
    dispatch(userSigninSuccess(res.data));
    const role = res.data.metadata.user.user_role;
    if (role === 'customer') {
      navigate('/');
    } else {
      window.location.href = 'http://localhost:3039';
    }
  } catch (error) {
    dispatch(userSigninFailure());
    return false;
  }
};

export const signup = async (user, dispatch, navigate) => {
  dispatch(userSignupStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/signup`, user);
    const refreshToken = res.data?.metadata?.metadata?.tokens?.refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(userSignupSuccess());
    navigate('/signin');
  } catch (error) {
    dispatch(userSignupFailure());
    return false;
  }
};

export const createAccount = async (user, dispatch) => {
  dispatch(userSignupStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/create-account`, user);
    const refreshToken = res.data?.metadata?.metadata?.tokens?.refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(userSignupSuccess());
  } catch (error) {
    dispatch(userSignupFailure());
    return false;
  }
};

export const logout = async (accessToken, userID, dispatch, navigate, axiosJWT) => {
  dispatch(userLogoutStart());
  try {
    await axiosJWT.post(
      `${REACT_APP_BASE_URL}user/logout`,
      {},
      {
        headers: {
          authorization: accessToken,
          user: userID,
        },
      }
    );
    dispatch(userLogoutSuccess());
    navigate('/');
  } catch (error) {
    dispatch(userLogoutFailure());
  }
};

export const updateUser = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(updateUserStart());
  try {
    const result = await axiosJWT.post(`${REACT_APP_BASE_URL}user/update`, data, {
      headers: {
        authorization: accessToken,
        user: userID,
      },
    });
    dispatch(updateUserSuccess());
    return result;
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

export const appointAdmin = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(updateUserStart());
  try {
    const result = await axiosJWT.post(`${REACT_APP_BASE_URL}user/update`, data, {
      headers: {
        authorization: accessToken,
        user: userID,
      },
    });
    dispatch(updateUserSuccess());
    return result;
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

export const changePassword = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(changePasswordStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}user/change-password`, data, {
      headers: {
        authorization: accessToken,
        user: userID,
      },
    });
    dispatch(changePasswordSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(changePasswordFailure());
  }
};

export const updateAccumulatePoint = async (accessToken, userID, point, dispatch) => {
  dispatch(updateUserStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}user/point`,
      {
        userID,
        point,
      },
      {
        headers: {
          authorization: accessToken,
          user: userID,
        },
      }
    );
    dispatch(updateUserSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

export const findUser = async (userID, dispatch) => {
  dispatch(findUserStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}user/find/${userID}`);
    dispatch(findUserSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findUserFailure());
  }
};

export const findAllUser = async (keySearch = '', dispatch) => {
  dispatch(findAllUsersStart());
  try {
    const link = keySearch === '' ? 'user' : `user?key=${keySearch}`;
    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`);
    dispatch(findAllUsersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllUsersFailure());
  }
};

export const findReceptionists = async (dispatch) => {
  dispatch(findAllReceptionistStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}user/find-receptionist`);
    dispatch(findAllReceptionistSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllReceptionistFailure());
  }
};

export const findAllBarber = async (dispatch) => {
  dispatch(findAllUsersStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}user/barber`);
    dispatch(findAllUsersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllUsersFailure());
  }
};

export const findAllFreeBarber = async (keySearch = '', startTime, endTime, dispatch) => {
  dispatch(findAllFreeBarberStart());
  try {
    let link = 'user/find-barber?';
    const params = [];

    if (keySearch) params.push(`key=${encodeURIComponent(keySearch)}`);
    if (startTime) params.push(`startTime=${encodeURIComponent(startTime)}`);
    if (endTime) params.push(`endTime=${encodeURIComponent(endTime)}`);

    link += params.join('&');

    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`);
    dispatch(findAllFreeBarberSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllFreeBarberFailure());
  }
};

export const banUser = async (accessToken, userID, deleteID, dispatch, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`${REACT_APP_BASE_URL}user/${deleteID}/${userID}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
        user: `${userID}`,
      },
    });
    dispatch(deleteUserSuccess());
    return res.data;
  } catch (error) {
    dispatch(deleteUserFailure());
    return false;
  }
};

// End user

// Upload
export const uploadImage = async (file, folderName, dispatch) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);
  dispatch(uploadImageStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(uploadImageSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(uploadImageFailure());
  }
};

export const uploadAudio = async (audio, dispatch) => {
  const formData = new FormData();
  formData.append('audio', audio);
  dispatch(uploadAudioStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}upload/answer-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(uploadAudioSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(uploadAudioFailure());
  }
};

// End upload

// Start comment

export const getComments = async (ID, dispatch) => {
  dispatch(getParentStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}comment/answer/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getParentSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getParentFailure());
  }
};

export const getReply = async (answerID, commentID, dispatch) => {
  dispatch(getChildrenStart());
  try {
    const link = `comment?answer_id=${answerID}&parent_comment_id=${commentID}`;
    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getChildrenSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getChildrenFailure());
  }
};

export const createComment = async (accessToken, comment, dispatch, navigate, axiosJWT) => {
  dispatch(createCommentStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}comment`, comment, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createCommentSuccess(res.data));
  } catch (error) {
    dispatch(createCommentFailure());
  }
};

export const deleteComment = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(deleteCommentStart());
  try {
    await axiosJWT.delete(`${REACT_APP_BASE_URL}comment`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
        user: `${userID}`,
      },
      data: data,
    });
    dispatch(deleteCommentSuccess());
  } catch (error) {
    dispatch(deleteCommentFailure());
  }
};

// End comment

// Start notification

export const getNotifications = async (userID, dispatch) => {
  dispatch(getAllNotificationsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}notification/list/${userID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllNotificationsSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getAllNotificationsFailure());
  }
};

export const createNotification = async (accessToken, notification, dispatch) => {
  dispatch(createNotificationStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}notification/create`, notification, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createNotificationSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createNotificationFailure());
  }
};

export const markRead = async (accessToken, notificationID, dispatch) => {
  dispatch(updateNotificationStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}notification/${notificationID}/mark-read`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateNotificationSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(updateNotificationFailure());
  }
};

export const deleteAllNotification = async (accessToken, userID, dispatch) => {
  dispatch(deleteSliderStart());
  try {
    await axios.delete(
      `${REACT_APP_BASE_URL}notification/delete-all/${userID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteSliderSuccess());
  } catch (error) {
    dispatch(deleteSliderFailure());
    return false;
  }
};

// End notification

// Start slider

export const getSlider = async (ID, dispatch) => {
  dispatch(getSliderStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider/find/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getSliderSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getSliderFailure());
  }
};

export const getAllSliders = async (dispatch) => {
  dispatch(getAllSlidersStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllSlidersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getAllSlidersFailure());
  }
};

export const getActiveSliders = async (dispatch) => {
  dispatch(getActiveSlidersStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider/find-active`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getActiveSlidersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getActiveSlidersFailure());
  }
};

export const getCollections = async (keySearch, dispatch) => {
  dispatch(getCollectionsStart());
  try {
    const link = keySearch === '' ? 'slider/collection' : `slider/collection?key=${keySearch}`;
    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getCollectionsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getCollectionsFailure());
  }
};

export const getByCollections = async (collection, dispatch) => {
  dispatch(getByCollectionStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider/collection/${collection}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getByCollectionSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getByCollectionFailure());
  }
};

export const createSlider = async (accessToken, slider, dispatch, navigate, axiosJWT) => {
  dispatch(createSliderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}slider/create`, slider, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createSliderSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createSliderFailure());
  }
};

export const updateSlider = async (accessToken, slider, dispatch, navigate, axiosJWT) => {
  dispatch(updateSliderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}slider/update`, slider, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateSliderSuccess(res.data));
    navigate('/management/collection');
  } catch (error) {
    dispatch(updateSliderFailure());
  }
};

export const toggleSlider = async (accessToken, slider, dispatch, navigate, axiosJWT) => {
  dispatch(toggleSliderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}slider/toggle`, slider, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(toggleSliderSuccess(res.data));
    getCollections(dispatch);
  } catch (error) {
    dispatch(toggleSliderFailure());
    return false;
  }
};

export const deleteSlider = async (accessToken, ID, dispatch, axiosJWT) => {
  dispatch(deleteSliderStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}slider/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteSliderSuccess());
  } catch (error) {
    dispatch(deleteSliderFailure());
    return false;
  }
};

export const deleteCollection = async (accessToken, collection, dispatch, axiosJWT) => {
  dispatch(deleteSliderStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}slider/collection/${collection}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteSliderSuccess());
  } catch (error) {
    dispatch(deleteSliderFailure());
    return false;
  }
};

// End slider

// Start service

export const getService = async (ID, dispatch) => {
  dispatch(getServiceStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}service/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getServiceSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    dispatch(getServiceFailure());
  }
};

export const getAllServices = async (dispatch) => {
  dispatch(getAllServicesStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}service/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllServicesSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllServicesFailure());
  }
};

export const createService = async (accessToken, service, dispatch, navigate, axiosJWT) => {
  dispatch(createServiceStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}service/create`, service, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createServiceSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createServiceFailure());
  }
};

export const updateService = async (accessToken, service, dispatch, navigate, axiosJWT) => {
  dispatch(updateServiceStart());
  try {
    const res = await axiosJWT.put(`${REACT_APP_BASE_URL}service/${service.service_id}`, service, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateServiceSuccess(res.data));
  } catch (error) {
    dispatch(updateServiceFailure());
  }
};

export const deleteService = async (accessToken, ID, dispatch, axiosJWT) => {
  dispatch(deleteServiceStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}service/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteServiceSuccess());
  } catch (error) {
    dispatch(deleteServiceFailure());
    return false;
  }
};

// End service

// Start appointment

export const getAppointment = async (ID, dispatch, populate) => {
  dispatch(getServiceStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/${ID}?populate=${populate}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getServiceSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    dispatch(getServiceFailure());
  }
};

export const getAllAppointments = async (dispatch) => {
  dispatch(getAllServicesStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/get-all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllServicesSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getAllServicesFailure());
  }
};

export const getAllAppointmentsOfBarber = async (barberID, dispatch) => {
  dispatch(findAllAppointmentsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/barber/${barberID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(findAllAppointmentsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllAppointmentsFailure());
  }
};

export const getAllAppointmentsOfUser = async (userPhone, dispatch) => {
  dispatch(findAllAppointmentsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/user/${userPhone}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(findAllAppointmentsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllAppointmentsFailure());
  }
};

export const createAppointment = async (appointment, dispatch) => {
  dispatch(createAppointmentStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}appointment/create`, appointment, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(createAppointmentSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createAppointmentFailure());
  }
};

export const updateAppointment = async (accessToken, appointment, dispatch) => {
  dispatch(updateAppointmentStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}appointment/${appointment._id}`,
      appointment,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateAppointmentSuccess(res.data));
  } catch (error) {
    dispatch(updateAppointmentFailure());
  }
};

export const updateAppointmentStatus = async (accessToken, appointmentID, status, dispatch) => {
  dispatch(updateAppointmentStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}appointment/${appointmentID}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateAppointmentSuccess(res.data));
    return res;
  } catch (error) {
    dispatch(updateAppointmentFailure());
  }
};

export const updateAppointmentProof = async (accessToken, appointmentID, proof, dispatch) => {
  dispatch(updateAppointmentStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}appointment/${appointmentID}/proof`,
      { complete_picture: proof },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateAppointmentSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(updateAppointmentFailure());
  }
};

export const deleteAppointment = async (accessToken, ID, dispatch) => {
  dispatch(deleteAppointmentStart());
  try {
    await axios.delete(
      `${REACT_APP_BASE_URL}appointment/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteAppointmentSuccess());
  } catch (error) {
    dispatch(deleteAppointmentFailure());
    return false;
  }
};

// End appointment

// Start inventory

export const getInventory = async (ID, dispatch) => {
  dispatch(getInventoryStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}inventory/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getInventorySuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    dispatch(getInventoryFailure());
  }
};

export const getAllInventories = async (dispatch) => {
  dispatch(getAllInventorysStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}inventory/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllInventorysSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllInventorysFailure());
  }
};

export const createInventory = async (accessToken, inventory, dispatch, navigate, axiosJWT) => {
  dispatch(createInventoryStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}inventory/add`, inventory, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createInventorySuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createInventoryFailure());
  }
};

export const updateInventory = async (accessToken, inventory, dispatch, navigate, axiosJWT) => {
  dispatch(updateInventoryStart());
  try {
    const res = await axiosJWT.put(
      `${REACT_APP_BASE_URL}inventory/${inventory.inventory_id}`,
      inventory,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateInventorySuccess(res.data));
  } catch (error) {
    dispatch(updateInventoryFailure());
  }
};

export const deleteInventory = async (accessToken, ID, dispatch, axiosJWT) => {
  dispatch(deleteInventoryStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}inventory/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteInventorySuccess());
  } catch (error) {
    dispatch(deleteInventoryFailure());
    return false;
  }
};

// End inventory

// Start invoice

export const getInvoice = async (ID, dispatch) => {
  dispatch(getInvoiceStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}invoice/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getInvoiceSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    dispatch(getInvoiceFailure());
  }
};

export const getAllInvoices = async (populate = true, dispatch) => {
  dispatch(getAllInvoicesStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}invoice/?populate=${populate}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllInvoicesSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllInvoicesFailure());
  }
};

export const createInvoice = async (accessToken, invoice, dispatch) => {
  dispatch(createInvoiceStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}invoice/create`, invoice, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createInvoiceSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createInvoiceFailure());
  }
};

export const updateInvoice = async (accessToken, invoice, dispatch) => {
  dispatch(updateInvoiceStart());
  try {
    const res = await axios.put(`${REACT_APP_BASE_URL}invoice/${invoice.invoice_id}`, invoice, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateInvoiceSuccess(res.data));
  } catch (error) {
    dispatch(updateInvoiceFailure());
  }
};

// End invoice

// Start review

export const getReview = async (ID, dispatch) => {
  dispatch(getReviewStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}review/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getReviewSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    dispatch(getReviewFailure());
  }
};

export const getAllReviews = async (dispatch) => {
  dispatch(getAllReviewsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}review`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllReviewsSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllReviewsFailure());
  }
};

export const getAllReviewsOfBarber = async (barberID, dispatch) => {
  dispatch(getAllReviewsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}review/barber/${barberID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllReviewsSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllReviewsFailure());
  }
};

export const createReview = async (accessToken, review, dispatch) => {
  dispatch(createReviewStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}review/create`, review, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createReviewSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createReviewFailure());
  }
};

// End review

// Start statistic

export const getIncomeOfSystemThisMonth = async (dispatch) => {
  dispatch(getSystemIncomeInMonthStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}statistic/system/income/month`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getSystemIncomeInMonthSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getSystemIncomeInMonthFailure());
  }
};

export const getIncomeOfSystemInDuration = async (start, end, dispatch) => {
  dispatch(getSystemIncomeInDurationStart());
  try {
    // Example: statistic/system/income?start=2025-04-01&end=2025-05-01
    const res = await axios.get(
      `${REACT_APP_BASE_URL}statistic/system/income?start=${start}&end=${end}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch(getSystemIncomeInDurationSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getSystemIncomeInDurationFailure());
  }
};

export const getIncomeOfSystemInYear = async (year, dispatch) => {
  dispatch(getSystemIncomeStart());
  try {
    // Example: statistic/system/income/year?year=2025
    const res = await axios.get(`${REACT_APP_BASE_URL}statistic/system/income/year?year=${year}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getSystemIncomeSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getSystemIncomeFailure());
  }
};

export const getIncomeOfBarberInYear = async (barberID, year, dispatch) => {
  dispatch(getBarberIncomeStart());
  try {
    // Example: statistic/barber/67f3e541c64356388d2db8e3/income/year?year=2025
    const res = await axios.get(
      `${REACT_APP_BASE_URL}statistic/barber/${barberID}/income/year?year=${year}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch(getBarberIncomeSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getBarberIncomeFailure());
  }
};

export const getAppointmentInYear = async (year, dispatch) => {
  dispatch(getSystemAppointmentStart());
  try {
    // Example: statistic/system/appointment/year?year=2025
    const res = await axios.get(
      `${REACT_APP_BASE_URL}statistic/system/appointment/year?year=${year}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch(getSystemAppointmentSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getSystemAppointmentFailure());
  }
};

export const getIncomeOfBarberInMonth = async (barberID, dispatch) => {
  dispatch(getBarberIncomeStart());
  try {
    // Example: statistic/barber/67f3e541c64356388d2db8e3/income/month
    const res = await axios.get(`${REACT_APP_BASE_URL}statistic/barber/${barberID}/income/month`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getBarberIncomeSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getBarberIncomeFailure());
  }
};

export const getIncomeOfBarbersInMonth = async (dispatch) => {
  dispatch(getBarbersIncomeStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}statistic/barbers/income/month`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getBarbersIncomeSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getBarbersIncomeFailure());
  }
};

export const getRatingOfBarber = async (barberID, dispatch) => {
  dispatch(getBarberRatingStart());
  try {
    // Example: statistic/barber/67eeaa265782c6cb88812688/rating
    const res = await axios.get(`${REACT_APP_BASE_URL}statistic/barber/${barberID}/rating`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getBarberRatingSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getBarberRatingFailure());
  }
};

export const getRatingsOfBarber = async (dispatch) => {
  dispatch(getBarbersRatingStart());
  try {
    // Example: statistic/barbers/rating
    const res = await axios.get(`${REACT_APP_BASE_URL}statistic/barbers/rating`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getBarbersRatingSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching statistic:', error);
    dispatch(getBarbersRatingFailure());
  }
};

// End statistic

// Start gift
export const getAllGifts = async (dispatch) => {
  dispatch(getAllGiftsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}gift/list`);
    dispatch(getAllGiftsSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllGiftsFailure());
    console.error('Failed to get gifts:', error);
  }
};

// Create a new gift
export const createGift = async (accessToken, giftData, dispatch) => {
  dispatch(createGiftStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}gift/create`, giftData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(createGiftSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(createGiftFailure());
    console.error('Failed to create gift:', error);
  }
};

// Update a gift
export const updateGift = async (accessToken, id, giftData, dispatch) => {
  dispatch(updateGiftStart());
  try {
    const res = await axios.put(`${REACT_APP_BASE_URL}gift/${id}/update`, giftData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(updateGiftSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(updateGiftFailure());
    console.error('Failed to update gift:', error);
  }
};

// Redeem a gift
export const redeemGift = async (accessToken, redeemData, dispatch) => {
  dispatch(redeemGiftStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}gift/redeem`, redeemData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(redeemGiftSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(redeemGiftFailure());
    console.error('Failed to redeem gift:', error);
  }
};

// Get user redemption history
export const getRedemptions = async (userID, dispatch) => {
  dispatch(getRedemptionsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}gift/redemptions?userID=${userID}`);
    dispatch(getRedemptionsSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(getRedemptionsFailure());
    console.error('Failed to fetch redemption history:', error);
  }
};

export const getAllRedemptions = async (dispatch) => {
  dispatch(getRedemptionsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}gift/all-redemption`);
    dispatch(getRedemptionsSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(getRedemptionsFailure());
    console.error('Failed to fetch redemption history:', error);
  }
};

export const deleteGift = async (accessToken, ID, dispatch) => {
  dispatch(deleteGiftStart());
  try {
    const res = await axios.delete(`${REACT_APP_BASE_URL}gift/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(deleteGiftSuccess());
    return res.data;
  } catch (error) {
    dispatch(deleteGiftFailure());
    console.error('Failed to delete redemption:', error);
  }
};

export const completeRedemption = async (accessToken, ID, dispatch) => {
  dispatch(deleteGiftStart());
  try {
    const res = await axios.delete(`${REACT_APP_BASE_URL}gift/redemption/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(deleteGiftSuccess());
    return res.data;
  } catch (error) {
    dispatch(deleteGiftFailure());
    console.error('Failed to delete redemption:', error);
  }
};

// End gift

// Start discount

// Get all discounts
export const getAllDiscounts = async (dispatch) => {
  dispatch(getAllDiscountsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}discount/list`);
    dispatch(getAllDiscountsSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllDiscountsFailure());
    console.error('Failed to get discounts:', error);
  }
};

// Create a new discount
export const createDiscount = async (accessToken, discountData, dispatch) => {
  dispatch(createDiscountStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}discount/create`, discountData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(createDiscountSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(createDiscountFailure());
    console.error('Failed to create discount:', error);
  }
};

// Update a discount
export const updateDiscount = async (accessToken, id, discountData, dispatch) => {
  dispatch(updateDiscountStart());
  try {
    const res = await axios.put(`${REACT_APP_BASE_URL}discount/${id}/update`, discountData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(updateDiscountSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(updateDiscountFailure());
    console.error('Failed to update discount:', error);
  }
};

// Apply a discount
export const applyDiscount = async (accessToken, applyData, dispatch) => {
  dispatch(applyDiscountStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}discount/apply`, applyData, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(applyDiscountSuccess(res.data.metadata));
    return res.data.metadata;
  } catch (error) {
    dispatch(applyDiscountFailure());
    console.error('Failed to apply discount:', error);
  }
};

// Get user's discounts
export const getUserDiscounts = async (userID, dispatch) => {
  dispatch(getUserDiscountsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}discount/user-discount/${userID}`);
    dispatch(getUserDiscountsSuccess(res.data.metadata));
    return res;
  } catch (error) {
    dispatch(getUserDiscountsFailure());
    console.error('Failed to fetch user discounts:', error);
  }
};

// Delete discount
export const deleteDiscount = async (accessToken, ID, dispatch) => {
  dispatch(deleteDiscountStart());
  try {
    const res = await axios.delete(`${REACT_APP_BASE_URL}discount/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    dispatch(deleteDiscountSuccess());
    return res.data;
  } catch (error) {
    dispatch(deleteDiscountFailure());
    console.error('Failed to delete discount:', error);
  }
};

// End discount

// Start salary

export const getAllSalary = async (month, year, dispatch) => {
  dispatch(getAllSalaryStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}salary?month=${month}&year=${year}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllSalarySuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getAllSalaryFailure());
  }
};

// End salary

// Start contact

export const contactViaEmail = async (data) => {
  try {
    await axios.post(`${REACT_APP_BASE_URL}contact`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to send contact email:', error);
  }
};

export const contactAboutRedemptionViaEmail = async (data) => {
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}contact/redemption`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.error('Failed to send contact email:', error);
  }
};

// End contact
