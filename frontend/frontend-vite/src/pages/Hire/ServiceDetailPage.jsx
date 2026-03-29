import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import ServiceDetail from "../../components/marketplace/ServiceDetail";
import LoadingSkeleton from "../../components/marketplace/LoadingSkeleton";
import EmptyState from "../../components/marketplace/EmptyState";

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!serviceId) {
      setError("Service ID is missing.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/jobs/${serviceId}`, { signal: controller.signal });
        setService(res.data?.data || res.data || null);
      } catch (err) {
        console.error("Failed to fetch service details", err);
        setError("Could not retrieve service details.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchService();

    return () => controller.abort();
  }, [serviceId]);

  const handleHire = async (service) => {
    if (!service?._id) return;
    try {
      await axiosInstance.post("/orders", {
        freelancerId: service.freelancer?._id || service.freelancerId,
        serviceId: service._id,
        price: service.price ?? 0,
      });
      navigate("../");
    } catch (err) {
      console.error(err);
      setError("Unable to create order. Please try again.");
    }
  };

  const handleMessage = (service) => {
    const freelancerId = service?.freelancer?._id || service?.freelancerId;
    if (!freelancerId) {
      setError("Freelancer contact missing.");
      return;
    }
    navigate(`/dashboard/chat?freelancerId=${freelancerId}&serviceId=${service._id}`);
  };

  if (loading) return <LoadingSkeleton count={1} />;
  if (error) return <EmptyState title="Error" message={error} />;
  if (!service) return <EmptyState title="Service not found" message="Please return to marketplace." />;

  return (
    <ServiceDetail
      service={service}
      onBack={() => navigate("../")}
      onHireNow={handleHire}
      onMessage={handleMessage}
    />
  );
}
