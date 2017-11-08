import axios from 'axios'

export default ({ inject }) => {
  inject('$axios', axios)
}
