import Add from './AddChannel.jsx';
import Remove from './RemoveChannel.jsx';
import Rename from './RenameChannel.jsx';

const modals = {
  addChannel: Add,
  renameChannel: Rename,
  removeChannel: Remove,
};

export default (modalName) => modals[modalName];
