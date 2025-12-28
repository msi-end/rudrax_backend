function organizeByPhase(data) {
   const phaseMap = data.reduce((result, item) => {
      const key = `${item.pro_id}_${item.col_project_phase}`;

      if (!result[key]) {
         result[key] = {
            phase: item.col_project_phase,
            pro_id: item.pro_id,
            pro_ref_no: item.pro_ref_no,
            project_name: item.pro_name,
            client_name: item.client_name,
            total_amount: 0,
            total_pct: item.col_pct,
            col_value: item.col_value,
            payment_status: 'pending',
            payments: [],
            payment_summary: {
               full_payment: 0,
               partial_payment: 0,
               partial_completed: 0,
            },
         };
      }

      const amount = Number(item.col_amount || 0);

      result[key].payments.push({
         col_id: item.col_id,
         amount,
         mode: item.col_mode,
         type: item.col_type,
         category: item.col_category,
         remark: item.col_remark,
         date: item.col_date,
         created_at: item.created_at,
      });

      result[key].total_amount += amount;

      if (item.col_type === 'full payment') {
         result[key].payment_summary.full_payment += amount;
      } else if (item.col_type === 'partial payment') {
         result[key].payment_summary.partial_payment += amount;
      } else {
         result[key].payment_summary.partial_completed += amount;
      }

      if (
         item.col_type === 'full payment' ||
         item.col_type === 'partial completed'
      ) {
         result[key].payment_status = 'completed';
      }

      return result;
   }, {});

   return Object.values(phaseMap);
}

module.exports = organizeByPhase;
