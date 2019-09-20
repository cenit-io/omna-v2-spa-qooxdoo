/**
 ** Actions
 * @require(omna.action.Add)
 * @require(omna.action.AddInChildren)
 * @require(omna.action.Authorize)
 * @require(omna.action.Edit)
 * @require(omna.action.Reload)
 * @require(omna.action.Remove)
 * @require(omna.action.Search)
 * @require(omna.action.integration.Import)
 * @require(omna.action.ReImport)
 * @require(omna.action.Separator)
 * @require(omna.action.order.Documents)
 * @require(omna.action.order.Print)
 *
 ** Cell Renderer
 * @require(omna.table.cellrenderer.Integration)
 * @require(omna.table.cellrenderer.LongText)
 *
 ** Network components
 * @require(omna.form.field.net.EMailField)
 * @require(omna.form.field.net.URLField)
 *
 ** Request services managements
 * @require(omna.request.Integrations)
 * @require(omna.request.Orders)
 * @require(omna.request.Products)
 * @require(omna.request.Tasks)
 *
 ** Management components
 * @require(omna.management.DataGridRestService)
 * @require(omna.management.HtmlEmbed)
 * @require(omna.management.task.Details)
 * @require(omna.management.order.Documents)
 *
 ** Nomenclature components
 * @require(omna.form.field.nomenclature.SelectBox)
 * @require(omna.form.field.nomenclature.ItemSelectBox)
 *
 ** Safety components
 * @require(omna.form.field.safety.PasswordField)
 *
 ** Boolean components
 * @require(omna.form.field.boolean.CheckBox)
 * @require(omna.form.field.boolean.RadioBox)
 * @require(omna.form.field.boolean.SelectBox)
 *
 *
 ** Remote components.
 * @require(omna.form.field.remote.SelectBox)
 * @require(omna.form.field.remote.ChannelSelectBox)
 * @require(omna.form.field.remote.FilteringSelectBox)
 *
 ** General components for bigness.
 * @require(omna.form.field.calendar.DateField)
 * @require(omna.form.field.GenderRadioBox)
 * @require(omna.form.field.IntegerField)
 * @require(omna.form.field.LocalSelectBox)
 * @require(omna.form.field.SimpleQuestionRadioBox)
 * @require(omna.form.field.SwitchRadioBox)
 * @require(omna.form.field.TextArea)
 * @require(omna.form.field.TextField)
 * @require(omna.form.field.NumberField)
 *
 ** DataGrid components.
 * @require(omna.form.field.grid.Gallery)
 *
 ** Validator class
 * @require(omna.form.validator.TextField)
 * @require(omna.form.validator.TextArea)
 * @require(omna.form.validator.net.EMailField)
 *
 */
qx.Mixin.define("omna.mixin.MComponents");
