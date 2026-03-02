export default function CourseCard({ course }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="course-cover-placeholder h-20 bg-gradient-to-br from-bg-card to-bg-card-hover flex items-center justify-center">
        <svg className="w-8 h-8 text-text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-text-primary mb-1 line-clamp-1">{course.title}</h4>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>{course.platform}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{course.type}</span>
        </div>
        <p className="text-xs text-text-secondary/60 mt-1 line-clamp-2 leading-relaxed">{course.description}</p>
      </div>
    </div>
  );
}
