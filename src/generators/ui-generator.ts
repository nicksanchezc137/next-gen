import { FIELD_TYPES, PAGE_TYPE } from "../constants";
import { DateTimePicker, Input, TextArea, Tile } from "../templates/components";
import {
  CREATE_PAGE_TEMPLATE,
  HOME_PAGE,
  INFO_PAGE_TEMPLATE,
  MAIN_APP,
  READ_PAGE_TEMPLATE,
  UPDATE_PAGE_TEMPLATE,
} from "../templates/pages";
import { Field, MarkUp, Model } from "../types";
import { getChildModels } from "../utils/general.utils";
//TODO:change class to PageGenerator
export class UIGenerator {
  models: Model[];

  constructor(models: Model[]) {
    this.models = models;
  }

  private getFieldsMarkUp(fields: Field[], isCreate: boolean) {
    let fieldsMarkup = "";
    fields.forEach((field) => {
      fieldsMarkup += this.getComponentMarkUp(field, isCreate);
    });
    return fieldsMarkup;
  }

  private getComponentMarkUp(field: Field, isCreate: boolean) {
    const fieldType = field.type.toUpperCase();
    switch (fieldType) {
      case FIELD_TYPES.NUMBER:
        return Input.instance(field);
      case FIELD_TYPES.DOUBLE:
        return Input.instance(field);
      case FIELD_TYPES.TEXT:
        return Input.instance(field);
      case FIELD_TYPES.LONG_TEXT:
        return TextArea.instance(field);
      case FIELD_TYPES.DATE_TIME:
        return DateTimePicker.instance(field, isCreate);
    }
  }
  private getModelPagesMarkUp(model: Model): MarkUp[] {
    let modelPagesMarkup = [];
    if (model.operations.CREATE) {
      modelPagesMarkup.push({
        ...CREATE_PAGE_TEMPLATE(
          this.getFieldsMarkUp(model.fields, true),
          PAGE_TYPE.CREATE,
          model.name,
          model.belongsTo
        ),
        modelName: model.name,
      });
    }
    if (model.operations.UPDATE) {
      modelPagesMarkup.push({
        ...UPDATE_PAGE_TEMPLATE(
          this.getFieldsMarkUp(model.fields, false),
          PAGE_TYPE.CREATE,
          model.name,
          model.belongsTo
        ),
        modelName: model.name,
      });
    }
    if (model.operations.READ) {
      modelPagesMarkup.push({
        ...READ_PAGE_TEMPLATE(
          model.name,
          getChildModels(this.models, model.name)
        ),
        modelName: model.name,
      });
    }
    let childModels = getChildModels(this.models, model.name);
    //only generate the info page if is a parent model with children
    if (childModels.length) {
      modelPagesMarkup.push({
        ...INFO_PAGE_TEMPLATE(model.name, childModels),
        modelName: model.name,
      });
    }

    return modelPagesMarkup;
  }
  generateHomePage() {
    return HOME_PAGE();
  }

  getAllPagesMarkUp(): MarkUp[] {
    let allPagesMarkUp: MarkUp[] = [];
    this.models.forEach((model) => {
      allPagesMarkUp = [
        ...allPagesMarkUp,
        ...this.getModelPagesMarkUp(model),
        MAIN_APP(),
        this.generateHomePage(),
      ];
    });
    return allPagesMarkUp;
  }
}
