import Swal from 'sweetalert2';
import routes from '../routes/routes';
import DrawerInitiator from '../utils/drawer-initiator';
import URLParser from '../routes/url-parser';
import checkAuth from '../utils/check-auth';

class App {
  constructor({ hamburger, drawer, content }) {
    this._hamburger = hamburger;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    DrawerInitiator.init({
      hamburger: this._hamburger,
      drawer: this._drawer,
      content: this._content,
    });
  }

  _switchClassActive() {
    const links = document.querySelectorAll('app-navbar a.block');
    const url = URLParser.UrlWithCombiner();
    links.forEach((link) => {
      if (link.getAttribute('href') === `#${url}` || link.getAttribute('href') === url) {
        link.classList.add('text-white', 'md:text-purple-600', 'dark:text-white', 'bg-purple-600', 'md:bg-transparent', 'rounded', 'dark:hover:bg-purple-700', 'hover:bg-purple-700');
        link.classList.remove('text-gray-700');
      } else {
        link.classList.remove('text-white', 'dark:text-white', 'md:text-purple-600', 'bg-purple-600', 'rounded', 'dark:hover:bg-purple-700', 'hover:bg-purple-700');
      }
    });
  }

  async renderPage() {
    const url = URLParser.UrlWithCombiner();
    const page = routes[url];

    try {
      Swal.fire({
        width: 100,
        allowOutsideClick: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      checkAuth();

      this._content.innerHTML = await page.render();
      Swal.close();
      this._switchClassActive();
      await page.afterRender();
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong, please try again later',
        icon: 'error',
      });
    }
  }
}

export default App;
