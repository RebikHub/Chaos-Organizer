import DnD from './dnd';
import Organizer from './organizer';
import Server from './server';

console.log('app started');

const dnd = new DnD();
const server = new Server();
const organizer = new Organizer(server);

dnd.events();
organizer.events();
