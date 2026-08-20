export function EventSkeleton() {
  return (
    <div
      className="event-card"
      style={{
        borderRadius: "0 4px 4px 0",
        padding: "24px",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          minWidth: 56,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 34,
            height: 10,
            background: "var(--text-muted)",
            opacity: 0.1,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            width: 50,
            height: 18,
            background: "var(--text-muted)",
            opacity: 0.15,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            width: 28,
            height: 8,
            background: "var(--text-muted)",
            opacity: 0.08,
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          width: 1,
          alignSelf: "stretch",
          background: "var(--text-muted)",
          opacity: 0.1,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            width: "60%",
            height: 16,
            background: "var(--text-muted)",
            opacity: 0.15,
            borderRadius: 2,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            width: "90%",
            height: 12,
            background: "var(--text-muted)",
            opacity: 0.1,
            borderRadius: 2,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            width: "40%",
            height: 10,
            background: "var(--text-muted)",
            opacity: 0.08,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}
