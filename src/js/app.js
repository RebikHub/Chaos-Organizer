import DnD from './dnd';
import Organizer from './organizer';
import Server from './server';

console.log('app started');

const server = new Server();
const dnd = new DnD(server);
const organizer = new Organizer(server);

dnd.events();
organizer.events();
