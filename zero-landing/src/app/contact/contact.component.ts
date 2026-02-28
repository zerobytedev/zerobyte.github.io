import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
    type: 'general' as 'general' | 'career'
  };

  get targetEmail(): string {
    return this.form.type === 'career' ? 'career@zerobyte.ge' : 'info@zerobyte.ge';
  }

  onSubmit(): void {
    // Basic validation
    if (!this.form.firstName || !this.form.email || !this.form.message) {
      alert('Please fill in First name, Email, and Message.');
      return;
    }

    const subject = encodeURIComponent(
      this.form.type === 'career' ?
        `Career Inquiry from ${this.form.firstName} ${this.form.lastName || ''}`.trim() :
        `New Inquiry from ${this.form.firstName} ${this.form.lastName || ''}`.trim()
    );

    const lines: string[] = [];
    lines.push(`Name: ${this.form.firstName} ${this.form.lastName || ''}`.trim());
    if (this.form.phone) lines.push(`Phone: ${this.form.phone}`);
    lines.push(`Email: ${this.form.email}`);
    lines.push('');
    lines.push('Message:');
    lines.push(this.form.message);

    const body = encodeURIComponent(lines.join('\n'));
    const mailto = `mailto:${this.targetEmail}?subject=${subject}&body=${body}`;

    // Open user email client via temporary anchor (more reliable cross-browser)
    const a = document.createElement('a');
    a.href = mailto;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
