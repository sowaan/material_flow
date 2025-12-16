


import frappe
from frappe.utils import nowdate

@frappe.whitelist()
def get_po_prefill_data(material_request, supplier, items):
    items = frappe.parse_json(items)
    mr = frappe.get_doc("Material Request", material_request)

    po_items = []

    for row in mr.items:
        if row.name in items:
            po_items.append({
                "item_code": row.item_code,
                "qty": row.qty,
                "uom": row.uom,
                "rate": row.rate,
                "schedule_date": nowdate(),
                "project": row.project or mr.project,
                "material_request": mr.name,
                "material_request_item": row.name
            })

    return {
        "company": mr.company,
        "supplier": supplier,
        "project": mr.project,
        "material_request": mr.name,
        "items": po_items
    }


