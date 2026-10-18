import { NextRequest, NextResponse } from "next/server";
import { requireWorkspaceRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { CustomerValidationModel } from "@/models/CustomerValidation";
import { mockDb } from "@/lib/mockDb";
import { CustomerValidationHubType, CustomerFeedbackItem } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "viewer");
    const workspaceId = access.workspace._id || id;

    const conn = await connectDB();
    if (conn) {
      const data = await CustomerValidationModel.findOne({ workspaceId }).lean();
      return NextResponse.json({ hub: data || null });
    }

    const data = mockDb.customerValidation.find((cv) => cv.workspaceId === workspaceId);
    return NextResponse.json({ hub: data || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { access } = await requireWorkspaceRole(id, "member");
    const workspaceId = access.workspace._id || id;
    const body = await req.json();

    const { type, feedback, persona, interviewQuestion } = body;

    const conn = await connectDB();
    let currentHub: any = null;

    if (conn) {
      currentHub = await CustomerValidationModel.findOne({ workspaceId });
      if (!currentHub) {
        currentHub = await CustomerValidationModel.create({
          workspaceId,
          customerPersonas: [],
          interviewQuestions: [
            "What is the most painful bottleneck in your current workflow?",
            "What manual workarounds or tools are you currently paying for?",
          ],
          surveyQuestions: [],
          feedbackRecords: [],
          overallDemandConfidence: "untested",
        });
      }
    } else {
      currentHub = mockDb.customerValidation.find((cv) => cv.workspaceId === workspaceId);
      if (!currentHub) {
        currentHub = {
          _id: "cv_" + Math.random().toString(36).substring(2, 9),
          workspaceId,
          customerPersonas: [],
          interviewQuestions: [
            "What is the most painful bottleneck in your current workflow?",
            "What manual workarounds or tools are you currently paying for?",
          ],
          surveyQuestions: [],
          feedbackRecords: [],
          overallDemandConfidence: "untested" as const,
        };
        mockDb.customerValidation.push(currentHub);
      }
    }

    if (type === "add_feedback" && feedback) {
      const newRecord: CustomerFeedbackItem = {
        id: "fb_" + Math.random().toString(36).substring(2, 8),
        intervieweeName: feedback.intervieweeName,
        intervieweeRole: feedback.intervieweeRole || "",
        date: feedback.date || new Date().toISOString().split("T")[0],
        category: feedback.category || "problem_validation",
        notes: feedback.notes,
        painPoints: feedback.painPoints || [],
        validationStatus: feedback.validationStatus || "inconclusive",
        consentObtained: Boolean(feedback.consentObtained),
        source: feedback.source || "video_call",
      };

      if (conn) {
        currentHub.feedbackRecords.unshift(newRecord);
        await currentHub.save();
        return NextResponse.json({ success: true, hub: currentHub });
      }

      currentHub.feedbackRecords.unshift(newRecord);
      return NextResponse.json({ success: true, hub: currentHub });
    }

    if (type === "add_persona" && persona) {
      const newPersona = {
        id: "cp_" + Math.random().toString(36).substring(2, 8),
        name: persona.name,
        role: persona.role || "",
        demographics: persona.demographics || "",
        coreFrustrations: persona.coreFrustrations || [],
        goals: persona.goals || [],
      };

      if (conn) {
        currentHub.customerPersonas.push(newPersona);
        await currentHub.save();
        return NextResponse.json({ success: true, hub: currentHub });
      }

      currentHub.customerPersonas.push(newPersona);
      return NextResponse.json({ success: true, hub: currentHub });
    }

    if (type === "add_question" && interviewQuestion) {
      if (conn) {
        currentHub.interviewQuestions.push(interviewQuestion);
        await currentHub.save();
        return NextResponse.json({ success: true, hub: currentHub });
      }
      currentHub.interviewQuestions.push(interviewQuestion);
      return NextResponse.json({ success: true, hub: currentHub });
    }

    return NextResponse.json({ error: "Invalid action or payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
