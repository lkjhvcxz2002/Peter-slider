import PSlider from '../components/PSlider.vue';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'PSlider',
  component: PSlider,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['purple', 'amber', 'rose', 'green'],
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { PSlider },
  data() {
    return {
      modelVal: 20
    }
  },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: `<div class="px-4 pt-20">
  <PSlider v-model="modelVal" v-bind="args"/>
  </div>
  <div class="px-4 mt-6">
  value: {{ modelVal }}
  </div>
  `,
});

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Default.args = {
  theme: 'purple'
};
