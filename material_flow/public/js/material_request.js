// frappe.ui.form.on('Material Request', {
//     refresh(frm) {
//         if (
//             frm.doc.docstatus === 1 &&
//             frm.doc.material_request_type === "Material Transfer"
//         ) {
//             frm.add_custom_button(
//                 __("Purchase Order"),
//                 () => {
//                     open_item_selection_dialog(frm);
//                 },
//                 __("Create")
//             );
//         }
//     }
// });

// function open_item_selection_dialog(frm) {
//     const items = (frm.doc.items || []).map(row => {
//         return {
//             label: `${row.item_code} - ${row.item_name}`,
//             value: row.name
//         };
//     });

//     const d = new frappe.ui.Dialog({
//         title: __("Create Purchase Order"),
//         fields: [
//             {
//                 fieldtype: "Link",
//                 fieldname: "supplier",
//                 label: __("Supplier"),
//                 options: "Supplier",
//                 reqd: 1
//             },
//             {
//                 fieldtype: "MultiCheck",
//                 fieldname: "items",
//                 label: __("Items"),
//                 options: items,
//                 reqd: 1
//             }
//         ],
//         primary_action_label: __("Create Purchase Order"),
//         primary_action(values) {
//             if (!values.supplier) {
//                 frappe.msgprint(__("Please select Supplier"));
//                 return;
//             }

//             if (!values.items || !values.items.length) {
//                 frappe.msgprint(__("Please select at least one item"));
//                 return;
//             }

//             // MultiCheck returns array of objects → extract values
//             const selected_items = values.items.map(i => i.value);

//             frappe.call({
//                 method: "material_flow.material_flow.api.get_po_prefill_data",
//                 args: {
//                     material_request: frm.doc.name,
//                     supplier: values.supplier,
//                     items: selected_items
//                 },
//                 callback(r) {
//                     if (!r.message) return;

//                     frappe.model.with_doctype("Purchase Order", () => {
//                         const po = frappe.model.get_new_doc("Purchase Order");

//                         po.company = r.message.company;
//                         po.supplier = r.message.supplier;
//                         po.project = r.message.project;
//                         po.material_request = r.message.material_request;

//                         (r.message.items || []).forEach(item => {
//                             const row = frappe.model.add_child(po, "items");
//                             Object.assign(row, item);
//                         });

//                         frappe.set_route("Form", "Purchase Order", po.name);
//                     });

//                     d.hide();
//                 }
//             });
//         }
//     });

//     d.show();
// }



frappe.ui.form.on('Material Request', {
    refresh(frm) {
        if (
            frm.doc.docstatus === 1 &&
            frm.doc.material_request_type === "Material Transfer"
        ) {
            frm.add_custom_button(
                __("Purchase Order"),
                () => {
                    open_item_selection_dialog(frm);
                },
                __("Create")
            );
        }
    }
});

function open_item_selection_dialog(frm) {
    let items = frm.doc.items.map(row => {
        return {
            label: `${row.item_code} - ${row.item_name}`,
            value: row.name
        };
    });

let d = new frappe.ui.Dialog({
    title: "Create Purchase Order",
    fields: [
        {
            fieldtype: "Link",
            fieldname: "supplier",
            label: "Supplier",
            options: "Supplier",
            reqd: 1
        },
        {
            fieldtype: "MultiCheck",
            fieldname: "items",
            label: "Items",
            options: items
        }
    ],
    primary_action_label: "Create Purchase Order",
    primary_action(values) {
        if (!values.supplier) {
            frappe.msgprint("Please select Supplier");
            return;
        }
        if (!values.items || !values.items.length) {
            frappe.msgprint("Please select at least one item");
            return;
        }

       frappe.call({
    method: "material_flow.material_flow.api.get_po_prefill_data",
    args: {
        material_request: frm.doc.name,
        supplier: values.supplier,
        items: values.items
    },
    callback(r) {
        if (r.message) {
            frappe.model.with_doctype("Purchase Order", () => {
                let po = frappe.model.get_new_doc("Purchase Order");

                po.company = r.message.company;
                po.supplier = r.message.supplier;
                po.project = r.message.project;
                po.material_request = r.message.material_request;

                r.message.items.forEach(item => {
                    let row = frappe.model.add_child(po, "items");
                    Object.assign(row, item);
                });

                frappe.set_route("Form", "Purchase Order", po.name);
            });

            d.hide();
        }
    }
});

    }
});


    d.show();
}
