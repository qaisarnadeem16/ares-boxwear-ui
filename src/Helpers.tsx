//import { UndoRedoStep } from 'interfaces';
import _ from "lodash";
import useStore from "./Store";
import {
  Group,
  Option,
  SellerSettings,
  useZakeke,
} from "zakeke-configurator-react";

import {
  DesignerHelper,
  DesignerSignature as DesignerSignature_,
  DesignerLogo as DesignerLogo_,
} from "./components/tray/DesignerHelper";

export interface UndoRedoStep {
  type: any;
  id: any;
  direction: string;
}

let isRegisteringUndoStep = false;

export const quitFullscreen = (element: HTMLElement) => {
  const exitFullscreen =
    document.exitFullscreen ||
    (document as any).webkitExitFullscreen ||
    (document as any).msExitFullscreen ||
    (document as any).mozCancelFullScreen;
  if (exitFullscreen) exitFullscreen.call(document as any);
};

export const launchFullscreen = (element: HTMLElement) => {
  const requestFullScreen =
    element.requestFullscreen ||
    (element as any).webkitRequestFullscreen ||
    (element as any).msRequestFullscreen ||
    (element as any).mozRequestFullScreen;

  if (requestFullScreen) requestFullScreen.call(element);
};

export const swap = (group: Group[], i: number, j: number) => {
  let temp = group[i];
  group[i] = group[j];
  group[j] = temp;
  return group;
};

export const useDefinitiveGroups = (
  groups: Group[],
  hasCustomizeEnabled: boolean,
  hasDesignsSaved: boolean,
  sellerSettings: SellerSettings | null
) => {
  const { isEditorMode, isViewerMode, isDraftEditor } = useStore();
  const definitiveGroups: Group[] = [];

  const customizeGroup: Group = {
    id: -2,
    guid: "0000-0000-0000-0000",
    name: sellerSettings?.customizeButtonLabel ?? T._("Customize", "Composer"),
    enabled: hasCustomizeEnabled,
    attributes: [],
    steps: [],
    cameraLocationId: "",
    displayOrder: groups.length - 1,
    direction: 0,
    attributesAlwaysOpened: false,
    imageUrl: sellerSettings?.customizeButtonIconUrl ?? "",
    templateGroups: [],
  };

  const savedConfigurationsGroup: Group = {
    id: -3,
    name: T._("Saved designs", "Composer"),
    imageUrl: "../src/assets/icons/saved_designs.svg",
    attributes: [],
    steps: [],
    guid: "",
    enabled: true,
    displayOrder: 0,
    cameraLocationId: null,
    direction: 0,
    attributesAlwaysOpened: false,
    templateGroups: [],
  };

  let groupsFiltered = groups.map((group) => {
    return {
      ...group,
      templateGroups: group.templateGroups,
      attributes: group.attributes
        .filter(
          (attribute) =>
            attribute.enabled && attribute.options.some((opt) => opt.enabled)
        )
        .map((attribute) => ({
          ...attribute,
          options: attribute.options.filter((x) => x.enabled),
        })),
    };
  });

  function filterAttributes(attributes: any[]) {
    let filteredAttributes = _.cloneDeep(attributes);

    for (let attribute of filteredAttributes)
      attribute.options = attribute.options.filter(
        (option: Option) => option.enabled
      );

    filteredAttributes = filteredAttributes.filter(
      (attr) => attr.enabled && attr.options.length > 0
    );

    return filteredAttributes;
  }

  for (const group of groupsFiltered) {
    if (group.enabled) {
      let newGroup = _.cloneDeep(group);

      for (let step of newGroup.steps) {
        step.attributes = filterAttributes(step.attributes);
      }
      newGroup.steps = newGroup.steps.filter(
        (step) => step.attributes.length > 0 || step.templateGroups.length > 0
      );
      newGroup.attributes = filterAttributes(newGroup.attributes);
      let count = newGroup.steps.reduce(
        (count, step) =>
          (count += step.attributes.length + step.templateGroups.length),
        0
      );
      count += newGroup.attributes.length + newGroup.templateGroups.length;

      if (count > 0) definitiveGroups.push(newGroup);
    }
  }

  if (hasCustomizeEnabled) {
    definitiveGroups.push(customizeGroup);
  }
  if (hasDesignsSaved && !isEditorMode && !isViewerMode && !isDraftEditor) {
    definitiveGroups.push(savedConfigurationsGroup);
  }
  return definitiveGroups;
};

export interface Translations {
  statics: Map<string, string>;
  dynamics: Map<string, string>;
}

export class T {
  public static translations: Translations | null = null;

  public static _(str: string, domain: string) {
    if (this.translations?.statics) {
      const keys = Array.from(this.translations?.statics.keys());
      for (let key of keys) {
        if (key.toLowerCase() === str.toLowerCase())
          return this.translations.statics.get(key);
      }
    }

    let gt = (window as any).gt;
    return gt ? gt.dgettext(domain, str) : str;
  }

  public static _d(str: string) {
    let string = str;
    if (this.translations?.dynamics) {
      const keys = Array.from(this.translations?.dynamics.keys());
      for (let key of keys) {
        if (key.toLowerCase() === str.toLowerCase()) {
          if (this.translations.dynamics.get(key))
            string = this.translations.dynamics.get(key) as string;
        }
      }
    }
    return string;
  }
}

export const range = (actualIndex: number, maxItems: number, array: any) => {
  let result = [];
  if (actualIndex <= maxItems) {
    for (let i = 0; i < maxItems; i++) {
      result.push(array[i]);
    }
  } else {
    let difference = actualIndex - maxItems;
    for (let k = difference; k < actualIndex; k++) {
      result.push(array[k]);
    }
  }
  return result;
};

export function formatString(str: string, ...args: string[]) {
  return args.reduce(
    (prev, current, idx) => prev.replace(`{${idx}}`, current),
    str
  );
}

export function findGroup(groups: Group[], groupId: number | null) {
  for (let group of groups) if (group.id === groupId) return group;

  return null;
}

export function findStep(groups: Group[], stepId: number | null) {
  for (let group of groups) {
    for (let step of group.steps) if (step.id === stepId) return step;
  }

  return null;
}

export function findAttribute(groups: Group[], attributeId: number | null) {
  for (let group of groups) {
    for (let attr of group.attributes) if (attr.id === attributeId) return attr;

    for (let step of group.steps)
      for (let attr of step.attributes)
        if (attr.id === attributeId) return attr;
  }
  return null;
}

export function useUndoRegister() {
  const { isUndo, setUndoStack } = useStore();

  function startRegisterUndoAction(isRegistering: boolean) {
    if (!isUndo) {
      setUndoStack((undoStack) => {
        let complexStep: { type: string; id: number }[] = [];
        let undoTypesStackRec = [...undoStack];

        if (isRegistering) {
          if (!isRegisteringUndoStep) {
            undoTypesStackRec.push(complexStep);
          }
        } else {
          if (
            undoTypesStackRec.length > 0 &&
            undoTypesStackRec[undoTypesStackRec.length - 1].length === 0
          )
            undoTypesStackRec.pop();
        }

        return undoTypesStackRec;
      });
    }

    return (isRegisteringUndoStep = isRegistering);
  }

  const startRegistering = () => {
    const current = isRegisteringUndoStep;
    if (!current) startRegisterUndoAction(true);

    return current;
  };

  const endRegistering = (current: boolean) => {
    if (!current) startRegisterUndoAction(false);
  };

  return { startRegistering, endRegistering };
}

export function useUndoRedoActions() {
  const { isUndo, setUndoStack, isRedo, setRedoStack } = useStore();

  const fillUndoStack = (undoStep: UndoRedoStep) => {
    if (!isUndo) {
      setUndoStack((undoStack) => {
        let tempUndoStack = [...undoStack];
        let actions = Array.isArray(undoStep) ? undoStep : [undoStep];
        const stepOrder = ["group", "step", "attribute", "option"];

        if (isRegisteringUndoStep) {
          let undoStep = tempUndoStack.pop() ?? [];
          // When passing multiple undo of the same type we need to keep the first that was passed because it's the oldest
          for (const action of actions)
            if (
              undoStep.findIndex(
                (x: UndoRedoStep) =>
                  x.type === action.type && x.direction === action.direction
              ) === -1
            )
              undoStep = [...undoStep, action];

          // Keep step actions sorted
          undoStep = undoStep.sort((a: UndoRedoStep, b: UndoRedoStep) =>
            stepOrder.indexOf(a.type) < stepOrder.indexOf(b.type) ? -1 : 1
          );

          tempUndoStack.push(undoStep);
        } else {
          // Keep step actions sorted
          actions = actions.sort((a, b) =>
            stepOrder.indexOf(a.type) < stepOrder.indexOf(b.type) ? -1 : 1
          );

          tempUndoStack = [...tempUndoStack, actions];
        }
        return tempUndoStack;
      });
    }
  };

  const fillRedoStack = (redoStep: UndoRedoStep | any) => {
    if (!isRedo) {
      setRedoStack((redoStack) => {
        let tempRedoStack = [...redoStack];
        if (redoStep && redoStep.length > 0) tempRedoStack.push(redoStep);
        return tempRedoStack;
      });
    }
  };

  const eraseRedoStack = () => {
    if (!isUndo && !isRedo) setRedoStack(() => []);
  };

  return { fillUndoStack, fillRedoStack, eraseRedoStack };
}

export function useActualGroups() {
  const {
    groups,
    isSceneLoading,
    product,
    isAreaVisible,
    draftCompositions,
    sellerSettings,
    items,
  } = useZakeke();

  // removed test
  let indexToRemove = groups.findIndex((obj) => obj.id === -1);
  if (indexToRemove !== -1) {
    groups.splice(indexToRemove, 1);
  }

  const shouldCustomizerGroupBeVisible =
    !isSceneLoading && product
      ? product.areas.some((area) => isAreaVisible(area.id))
      : false;
  const hasDesignsSaved =
    (groups && draftCompositions && draftCompositions.length > 0) ?? false;

  const actualGroups =
    useDefinitiveGroups(
      groups,
      shouldCustomizerGroupBeVisible,
      hasDesignsSaved,
      sellerSettings
    ) ?? [];

  indexToRemove = actualGroups.findIndex((obj) => obj.id === -2);

  if (indexToRemove !== -1) {
    actualGroups.splice(indexToRemove, 1);
  }

  const itemAvailable = items?.filter((item) => item.type === 0).length > 0;

  if (items && !itemAvailable) {
    const tipIndex_ = actualGroups.findIndex((x) => x.name === "OVERLAY TYPE");
    if (tipIndex_ > 0) actualGroups.splice(tipIndex_, 1);
  }

  if (!isSceneLoading) {
    const templatesSignature = DesignerSignature_();
    const templatesLogo = DesignerLogo_();

    let groupTemplatesSignature = actualGroups;

    templatesSignature?.map((x) => {
      groupTemplatesSignature.push({
        id: x.id,
        guid: x.cameraLocationID,
        name: x.name,
        enabled: true,
        attributes: [],
        steps: [],
        cameraLocationId: x.cameraLocationID,
        displayOrder: 3,
        direction: 2,
        attributesAlwaysOpened: false,
        imageUrl: "",
        templateGroups: [],
      });
    });

    templatesLogo?.map((x) => {
      groupTemplatesSignature.push({
        id: x.id,
        guid: x.cameraLocationID,
        name: x.name,
        enabled: true,
        attributes: [],
        steps: [],
        cameraLocationId: x.cameraLocationID,
        displayOrder: 3,
        direction: 3,
        attributesAlwaysOpened: false,
        imageUrl: "",
        templateGroups: [],
      });
    });
  }

  return actualGroups;
}

export function makeFirstLetterCaps(sentence: any) {
  if (sentence) {
    const trimmedSentence = sentence ? sentence.trim() : '';

    const str = trimmedSentence.split(" ");
    // const str = sentence.split(" ");

    for (let i = 0; i < str.length; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1).toLowerCase();
    }
    let newSentence: any = str.join(" ");
    return newSentence;
  }
}

export async function downloadImage(url: any) {
  try {
    // Replace the URL with your actual image URL
    const imageUrl = url;

    // Fetch the image as a blob
    const response = await fetch(imageUrl); //, { responseType: 'blob' });
    const imageBlob = await response.blob();

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(imageBlob);

    // Create an anchor element
    const link = document.createElement("a");
    link.href = blobUrl;

    // Set the download attribute with the desired file name
    link.download = "yourImage.jpg";

    // Append the anchor element to the document
    document.body.appendChild(link);

    // Trigger a click on the anchor element
    link.click();

    // Remove the anchor element and revoke the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

export const updateSelectedTray = (direction: number) => {
  if (direction === 0) {
    return "colors";
  } else if (direction === 2) {
    return "signature";
  } else if (direction === 3) {
    return "logos";
  }
  return "logos";
};
