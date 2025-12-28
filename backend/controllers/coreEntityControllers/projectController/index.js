const projectCoreModel = require('@/models/coreEntityModels/projectModel');

class projectCoreController {
   static async getFullProject_OtherDetails_(req, res) {
      const { pro_id } = req.params;
      try {
         const rawData = await projectCoreModel.getProjectDetails(pro_id);

         const structuredData = {
            contractors:
               rawData[0]?.map((contractor) => ({
                  pro_con_id: contractor.pro_con_id,
                  pro_id: contractor.pro_id,
                  con_id: contractor.con_id,
                  pro_phase: contractor.pro_phase,
                  pro_sub_phase: contractor.pro_sub_phase,
                  con_name: contractor.con_name,
               })) || [],

            phases:
               rawData[1]?.reduce((acc, phase) => {
                  const existingPhase = acc.find((p) => p.pro_phase_id === phase.pro_phase_id);

                  if (!existingPhase) {
                     const newPhase = {
                        pro_phase_id: phase.pro_phase_id,
                        phase_id: phase.phase_id,
                        pro_id: phase.pro_id,
                        pro_phase_status: phase.pro_phase_status,
                        pro_phase_deadline: phase.pro_phase_deadline,
                        created_at: phase.pro_phase_created_at,
                        phase_name: phase.phase_name,
                        phase_alt_name: phase.phase_alt_name,
                        phaseTask: [],
                     };

                     if (phase.pt_id) {
                        newPhase.phaseTask.push({
                           pt_id: phase.pt_id,
                           pro_phase_task: phase.pro_phase_task,
                           pro_phase: phase.phase_task_name,
                           pro_subphase: phase.phase_task_alt_name,
                           deadline: phase.task_deadline,
                           pt_status: phase.pt_status,
                           created_at: phase.task_created_at,
                        });
                     }

                     acc.push(newPhase);
                  } else if (phase.pt_id) {
                     existingPhase.phaseTask.push({
                        pt_id: phase.pt_id,
                        pro_phase_task: phase.pro_phase_task,
                        pro_phase: phase.phase_task_name,
                        pro_subphase: phase.phase_task_alt_name,
                        deadline: phase.task_deadline,
                        pt_status: phase.pt_status,
                        created_at: phase.task_created_at,
                     });
                  }

                  return acc;
               }, []) || [],
            documents: rawData[2],
            client: rawData[3],
            project_status: rawData.prject_status,
         };

         res.status(200).send({
            status: true,
            msg: 'Project Data retrieved successfully',
            data: structuredData,
         });
      } catch (error) {
         console.error('Create Error:', error);
         res.status(500).send({
            status: false,
            msg: 'Failed to get data',
            data: null,
         });
      }
   }
}

module.exports = projectCoreController;
