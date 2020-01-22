/* THIS FILE SHOULD BE ADDED TO `/app/templates/app/store` FOLDER AS-IS */
// This import enable module augmentation instead of module overwrite
import 'quasar';

declare module 'quasar' {
  interface QuasarFeatureFlags {
    store: true;
  }
}