import { render } from './framework/render.js';
import FiltersComponent from './view/filters.js';
import BoardPresenter from './presenter/board-presenter.js';
import SiteMenu from './view/menu.js';
import PointsModel from './model/points-model.js';
import { getPoints, getDestinations, getOptionsByCategory } from './mock/point-generator.js';
import { buildFilter } from './mock/filter-generator.js';

const headerElement = document.querySelector('.trip-main');
const mainElement = document.querySelector('.page-main');

const pointsModel = new PointsModel();
pointsModel.init(getPoints(), getDestinations(), getOptionsByCategory());

const boardPresenter = new BoardPresenter(mainElement.querySelector('.trip-events'), pointsModel);
boardPresenter.init();

const filters = buildFilter(pointsModel.points);

render(new FiltersComponent({ filters }), headerElement.querySelector('.trip-controls__filters'));
render(new SiteMenu(), headerElement.querySelector('.trip-controls__navigation'));
