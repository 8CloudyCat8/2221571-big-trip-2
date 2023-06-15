import { render } from './framework/render.js';
import SiteMenuView from './view/menu-view.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers-model.js';
import PlacesApiService from './api-service/places-api-service.js';
import TravelsApiService from './api-service/travels-api-service.js';
import DealsApiService from './api-service/deals-api-service.js';
import FilterPresenter from './presenter/filter.js';
import BoardPresenter from './presenter/board.js';
import NewPointButtonPresenter from './presenter/new-point-button.js';
import { API, VERIFICATION } from './const.js';

const HeaderElement = document.querySelector('.trip-main');
const MainElement = document.querySelector('.page-main');

const menuView = new SiteMenuView();

const pointsModel = new PointsModel(new PlacesApiService(API, VERIFICATION));
const targetsModel = new DestinationsModel(new TravelsApiService(API, VERIFICATION));
const offersModel = new OffersModel(new DealsApiService(API, VERIFICATION));

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: HeaderElement.querySelector('.trip-controls__filters'),
  pointsModel,
  targetsModel,
  offersModel,
  filterModel
});
filterPresenter.init();

const boardPresenter = new BoardPresenter({
  tripInfoContainer: HeaderElement.querySelector('.trip-main__trip-info'),
  tripContainer: MainElement.querySelector('.trip-events'),
  pointsModel,
  filterModel,
  targetsModel,
  offersModel
});
boardPresenter.init();

const newPointButtonPresenter = new NewPointButtonPresenter({
  newPointButtonContainer: HeaderElement,
  targetsModel,
  pointsModel,
  offersModel,
  boardPresenter
});
newPointButtonPresenter.init();

offersModel.init()
  .finally(() => targetsModel.init()
    .finally(() => pointsModel.init()
      .finally(() => newPointButtonPresenter.renderNewPointButton())));

render(menuView, HeaderElement.querySelector('.trip-controls__navigation'));
