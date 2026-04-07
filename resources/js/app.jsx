import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import SpaApp from './SpaApp';

const el = document.getElementById('app');

if (el) {
    createRoot(el).render(<SpaApp />);
}
