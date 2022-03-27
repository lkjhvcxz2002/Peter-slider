# Peter-slider

## Project setup
```
npm install
```

## Run Project
```
npm run storybook
```

## Usage
```
// main.js
import Vue from 'vue'
import PSlider from './src/components/PSlider.vue'

Vue.component('PSlider', PSlider)
```

## Options
### Props
Props | Type | Default | Description |
---|---|---|---|
| v-model       | Number,String  | 0        | Initial value (v-model)|
| min         | Number        | 0        | Minimum value   |
| max         | Number        | 100      | Maximum value   |
| is-disabled       | Boolean        | false      | Flag for disable slider bar |
| draggable      | Boolean       | true     | Flag for active/disable draggable |
| show-cursor      | Boolean       | true     | Flag display cursor |
| show-tooltip      | Boolean       | true     | Flag display tooltip |
| speed       | Number        | 0.5      | Transition time |
| theme       | String        | purple      | Custom color theme, ex: purple, rose |

### Events
| Name          | Description  |
| --------------|--------------|
| input | triggered on value change |
| dragStart | triggered on start drag |
| dragEnd | triggered on stop drag |
